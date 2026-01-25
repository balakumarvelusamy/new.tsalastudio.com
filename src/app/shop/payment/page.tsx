'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import config from '../../../config.json';
import Link from 'next/link';
import { useCart } from '../../../context/CartContext';
import { saveItem, filterItems } from '../../../services/api';
import secureLocalStorage from 'react-secure-storage';

import { decryptParams } from '../../../utils/encryption';

// declare global razorpay
declare global {
    interface Window {
        Razorpay: any;
    }
}

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');

    // Decrypt Params
    const encryptedData = searchParams.get('q');
    let decryptedParams: any = {};

    if (encryptedData) {
        decryptedParams = decryptParams(encryptedData) || {};
    } else {
        // Fallback for legacy/direct support (optional, or we can block it)
        // For now, allow direct if q is missing but warn/block in production if strict.
        decryptedParams = {
            amount: searchParams.get('amount'),
            orderid: searchParams.get('orderid'),
            name: searchParams.get('name'),
            email: searchParams.get('email'),
            phone: searchParams.get('phone')
        };
    }

    const amount = decryptedParams.amount || '0';
    const orderId = decryptedParams.orderid || '';
    const name = decryptedParams.name || '';
    const email = decryptedParams.email || '';
    const phone = decryptedParams.phone || '';

    const [isValid, setIsValid] = useState(false);

    // Verify against local storage sanity check (Anti-tamper)
    useEffect(() => {
        const checkSecurity = () => {
            try {
                const temp = secureLocalStorage.getItem('tempOrderData') as any;

                // If no local data, we can't verify, so purely redundant security: fail safe or strict?
                // Strict: If user has no local data, they shouldn't be here (session lost or deep link).
                if (!temp || temp.id !== orderId) {
                    console.error("Security Alert: No matching local order data found.");
                    alert("Security Error: Order session expired or invalid. Please restart checkout.");
                    router.push('/shop/checkout');
                    return;
                }

                const localAmount = temp.totals?.grandTotal?.toString();

                // Allow small floating point diff
                if (localAmount && Math.abs(parseFloat(localAmount) - parseFloat(amount)) > 1) {
                    console.error("Security Alert: Price Mismatch!", "URL:", amount, "Local:", localAmount);
                    alert("Security Error: Payment amount mismatch detected. Please restart checkout.");
                    router.push('/shop/checkout');
                    return;
                }

                // Passed checks
                setIsValid(true);
            } catch (e) {
                console.error("Security check error", e);
                router.push('/shop/checkout');
            }
        };

        if (orderId && amount) {
            checkSecurity();
        }
    }, [amount, orderId, router]);

    // Load Razorpay Script
    const loadScript = (src: string) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);
        setStatus('processing');

        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            setStatus('failed');
            return;
        }

        try {
            // 1. Create Order on Server via Local API
            const _data = {
                amount: parseFloat(amount) * 100, // Amount in paise
            };

            console.log("Frontend: Creating order via local API...", _data);
            const response = await fetch("/api/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(_data)
            });
            console.log("Order API Response:", response);
            const data = await response.json();

            if (response.ok) {
                const options = {
                    key: data.keyId, // Use key returned from server (key_id_test from accountconfig)
                    amount: _data.amount,
                    currency: "INR",
                    name: "Tsala Studio",
                    description: "Order Payment",
                    order_id: data.orderId,
                    handler: async function (response: any) {
                        console.log("Success:", response);

                        // --- NEW: Save Order & User Logic ---
                        let finalOrderPayload: any = null;
                        try {
                            // Retrieve temporary order data
                            const tempOrderData: any = secureLocalStorage.getItem('tempOrderData');

                            if (!tempOrderData) {
                                console.error("Missing temp order data");
                                alert("Order processed but local data missing. Please contact support.");
                                return;
                            }

                            let finalUserId = tempOrderData.userId;

                            // 1. Handle Guest User (Check & Create)
                            if (finalUserId === 'guest') {
                                try {
                                    // Check if user exists by email
                                    const existingUsers = await filterItems('email', email, 'type', 'user');

                                    if (existingUsers && existingUsers.length > 0) {
                                        finalUserId = existingUsers[0].id;
                                        console.log("Mapped to existing user:", finalUserId);
                                    } else {
                                        // Create new user
                                        const newUserId = crypto.randomUUID();
                                        const newUser = {
                                            id: newUserId,
                                            type: 'user',
                                            name: name,
                                            email: email,
                                            phone: phone, // This phone comes from billing as per checkout redirect params
                                            address: tempOrderData.billingAddress?.address || tempOrderData.shippingAddress?.address || '',
                                            city: tempOrderData.billingAddress?.city || tempOrderData.shippingAddress?.city || '',
                                            state: tempOrderData.billingAddress?.state || tempOrderData.shippingAddress?.state || '',
                                            pincode: tempOrderData.billingAddress?.pincode || tempOrderData.shippingAddress?.pincode || '',
                                            createddate: new Date().toISOString(),
                                            isactive: 1
                                            // No password
                                        };
                                        await saveItem(newUser);
                                        finalUserId = newUserId;
                                        console.log("Created new guest user:", newUserId);
                                    }
                                } catch (e) {
                                    console.error("User registration check failed", e);
                                    // Fallback? finalUserId still 'guest'
                                }
                            }

                            // 2. Save FULFILLED Order
                            finalOrderPayload = {
                                ...tempOrderData,
                                userId: finalUserId,
                                orderstatus: 'Received', // Directly to Received
                                paymentstatus: 'Completed',
                                paymentmethod: 'Online',
                                authid: response.razorpay_payment_id,
                                type: 'order',
                                razororderid: data.orderId,
                                razorreceipt: data.receipt
                            };

                            await saveItem(finalOrderPayload);
                            console.log("Order saved successfully");

                            // Clear Cart (Context + Storage/DB)
                            clearCart();

                            // Clear temp data
                            secureLocalStorage.removeItem('tempOrderData');

                        } catch (err) {
                            console.error("Critical Error saving post-payment order:", err);
                            alert("Payment successful but order saving failed. Please contact support with Order ID: " + orderId);
                        }
                        // --- End Save Logic ---

                        setStatus('success');

                        // Send Email (Non-blocking)
                        if (finalOrderPayload) {
                            sendEmail(name, email, orderId, "Received", "Completed", finalOrderPayload).catch(console.error);
                        }

                        router.push('/shop/success?orderid=' + orderId);
                    },
                    prefill: {
                        name: name,
                        email: email,
                        contact: phone
                    },
                    theme: {
                        color: config.themecolor || "#d4a574",
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
                paymentObject.on('payment.failed', function (response: any) {
                    console.error("Payment Failed", response);
                    setStatus('failed');
                    // We don't save the order on failure as per request ("save ... only after payment confirmed")
                    // But maybe we should save a "Failed" record? 
                    // User said "save order ... only after payment is confirmed".
                    // So we do NOTHING to the DB on failure. Just alert.
                    alert("Payment Failed: " + response.error.description);
                });

            } else {
                console.error("Payment API Error:", data);
                alert(`Server Error: ${data.message} - ${data.error || ''}`);
                setStatus('failed');
            }

        } catch (err: any) {
            console.error("Payment Initialization Error:", err);
            setStatus('failed');
            alert(`Payment Init Failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Removed updatePaymentStatus as we save the full order now

    const sendEmail = async (name: string, email: string, orderid: string, paymentstatus: string, orderstatus: string, orderDetails: any) => {
        // Build Items Table
        const items = orderDetails?.items || [];
        const itemsHtml = items.map((item: any) => `
            <tr>
                <td style="border-bottom: 1px solid #eee; padding: 12px; color: #333;">
                    <div style="font-weight: 500;">${item.name}</div>
                </td>
                <td style="border-bottom: 1px solid #eee; padding: 12px; text-align: center; color: #555;">${item.quantity}</td>
                <td style="border-bottom: 1px solid #eee; padding: 12px; text-align: right; color: #555;">₹${item.price.toFixed(2)}</td>
                <td style="border-bottom: 1px solid #eee; padding: 12px; text-align: right; font-weight: 500; color: #333;">₹${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        const { cartTotal, shippingCost, taxAmount, grandTotal } = orderDetails?.totals || { cartTotal: 0, shippingCost: 0, taxAmount: 0, grandTotal: 0 };

        const body = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #d4a574; padding: 20px; text-align: center; color: white;">
                     <h2 style="margin: 0; font-size: 24px;">Order Confirmed!</h2>
                     <p style="margin: 5px 0 0 0; opacity: 0.9;">Order ID: ${orderid}</p>
                </div>
                
                <div style="padding: 24px;">
                    <p style="font-size: 16px; color: #333;">Hello <strong>${name}</strong>,</p>
                    <p style="color: #555; line-height: 1.5;">Thank you for your purchase from Tsala Studio. We have received your order and we are processing it.</p>
                    
                    <div style="margin: 24px 0; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                         <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <thead>
                                <tr style="background-color: #f9f9f9;">
                                    <th style="padding: 12px; text-align: left; color: #666; font-weight: 600; text-transform: uppercase; font-size: 12px;">Product</th>
                                    <th style="padding: 12px; text-align: center; color: #666; font-weight: 600; text-transform: uppercase; font-size: 12px;">Qty</th>
                                    <th style="padding: 12px; text-align: right; color: #666; font-weight: 600; text-transform: uppercase; font-size: 12px;">Price</th>
                                    <th style="padding: 12px; text-align: right; color: #666; font-weight: 600; text-transform: uppercase; font-size: 12px;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" style="padding: 12px; text-align: right; color: #666;">Subtotal</td>
                                    <td style="padding: 12px; text-align: right; color: #333;">₹${cartTotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="padding: 12px; text-align: right; color: #666;">Shipping</td>
                                    <td style="padding: 12px; text-align: right; color: #333;">${shippingCost === 0 ? 'Free' : '₹' + shippingCost}</td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="padding: 12px; text-align: right; color: #666;">Tax</td>
                                    <td style="padding: 12px; text-align: right; color: #333;">₹${taxAmount.toFixed(2)}</td>
                                </tr>
                                <tr style="background-color: #f9f9f9;">
                                    <td colspan="3" style="padding: 16px 12px; text-align: right; font-weight: bold; color: #333; font-size: 16px;">Grand Total</td>
                                    <td style="padding: 16px 12px; text-align: right; font-weight: bold; color: #e65100; font-size: 16px;">₹${grandTotal.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px;">
                        <h4 style="margin: 0 0 10px 0; color: #333;">Order Details</h4>
                         <table style="width: 100%; font-size: 14px;">
                            <tr>
                                <td style="padding: 4px 0; color: #666;">Payment Status:</td>
                                <td style="padding: 4px 0; color: #2e7d32; font-weight: bold;">${paymentstatus}</td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0; color: #666;">Order Status:</td>
                                <td style="padding: 4px 0; color: #1976d2; font-weight: bold;">${orderstatus}</td>
                            </tr>
                         </table>
                    </div>
                    
                    <p style="margin-top: 24px; color: #777; font-size: 12px; text-align: center;">
                        If you have any questions, please contact us at <a href="mailto:${config.contact_email}" style="color: #d4a574; text-decoration: none;">${config.contact_email}</a>
                    </p>
                </div>
            </div>
          `;

        try {
            await fetch(config.email_service_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    from: config.fromemail,
                    to: (config as any).env === 'test' ? email : `${email},${config.fromemail}`,
                    subject: `Order Confirmation - ${orderid}`,
                    text: `Order ${orderid} confirmed. Total: ₹${grandTotal.toFixed(2)}`,
                    html: body,
                }),
            });
        } catch (e) {
            console.error("Failed to send email", e);
        }
    };

    return (
        <div className="container-custom py-20">
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-primary/5 p-6 text-center border-b border-gray-100">
                    <h1 className="text-2xl font-heading font-bold text-gray-900">Complete Your Payment</h1>
                    <p className="text-gray-500 text-sm mt-1">Order ID: {orderId}</p>
                </div>

                <div className="p-8 text-center space-y-6">
                    <div className="text-4xl font-bold text-primary">
                        ₹{parseFloat(amount).toFixed(2)}
                    </div>

                    <div className="text-gray-600 text-sm bg-gray-50 p-4 rounded-xl">
                        <p><strong>Billed To:</strong> {name}</p>
                        <p>{email}</p>
                        <p>{phone}</p>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={loading || status === 'success' || !isValid}
                        className="btn btn-primary w-full py-4 text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Pay Now Securely'}
                    </button>

                    <p className="text-xs text-gray-400">
                        Secure payments by Razorpay.
                        {status === 'failed' && <span className="text-red-500 block mt-2">Payment failed. Please try again.</span>}
                    </p>
                </div>

                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                    <Link href="/shop/checkout" className="text-sm text-gray-500 hover:text-gray-800 underline">
                        Cancel and Return to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center">Loading Payment...</div>}>
            <PaymentContent />
        </Suspense>
    );
}
