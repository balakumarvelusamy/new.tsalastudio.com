'use client';
import React, { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import Link from 'next/link';
import config from '../../../config.json';
import { getItemsById, getItemsByType, filterItems } from '../../../services/api';
import secureLocalStorage from 'react-secure-storage';
import { encryptParams } from '../../../utils/encryption';

interface AddressForm {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}

const InputField = ({ label, name, type = "text", value, onChange, placeholder, required = true, className = "", inputMode = undefined, pattern = undefined, maxLength = undefined }: any) => (
    <div className={`space-y-1.5 ${className}`}>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            name={name}
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            inputMode={inputMode}
            pattern={pattern}
            maxLength={maxLength}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-gray-400 invalid:ring-red-500 invalid:text-red-600"
        />
    </div>
);

export default function CheckoutPage() {
    const { cartItems, cartTotal, shippingCost, taxAmount, grandTotal, userId: contextUserId } = useCart();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // Form States
    const [shippingAddress, setShippingAddress] = useState<AddressForm>({
        name: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
    });

    const [billingAddress, setBillingAddress] = useState<AddressForm>({
        name: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
    });

    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [orderNotes, setOrderNotes] = useState('');

    // Pre-fill user data
    // Pre-fill user data
    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 10;

        const fetchUserData = async () => {
            let foundUuid: string | null = contextUserId;

            if (!foundUuid && typeof window !== 'undefined') {
                try {
                    foundUuid = secureLocalStorage.getItem('tsalauuid') as string;
                    if (!foundUuid) foundUuid = localStorage.getItem('tsalauuid');
                } catch (e) {
                    console.error("Storage access error:", e);
                }
            }

            if (foundUuid) {
                if (foundUuid !== userId) {
                    setUserId(foundUuid);
                }

                try {
                    // Strict: Use getItemsById(userid)
                    const response = await getItemsById(foundUuid);
                    console.log("Auto-fill: Raw API Response", response);

                    // Handle response: Filter for type === 'user'
                    let userData = null;

                    // Helper to identify user object
                    const isUserObject = (item: any) => {
                        // Strict check
                        if (item.type === 'user' || item.type === 'User') return true;
                        // Heuristic check (if type is missing or vague)
                        // User has email/name/phone but NOT productid/quantity/price (typically)
                        if ((item.email || item.useremail) && !item.price && !item.quantity) return true;
                        return false;
                    };

                    if (Array.isArray(response)) {
                        userData = response.find(isUserObject);
                        // If still not found, just take the first one that looks like a user? 
                        // Or maybe the user reported cart data because they just saw the first item.
                    } else if (response) {
                        if (isUserObject(response)) userData = response;
                    }

                    if (userData) {
                        console.log("Auto-fill: User Profile matched", userData);

                        const mappedAddress = {
                            name: userData.name || userData.username || '',
                            email: userData.email || userData.useremail || '',
                            phone: userData.phone || userData.phonenumber || userData.mobile || '',
                            address: userData.address || '',
                            city: userData.city || '',
                            state: userData.state || '',
                            pincode: userData.pincode || userData.zip || ''
                        };

                        setShippingAddress(prev => ({ ...prev, ...mappedAddress }));
                        setBillingAddress(prev => ({ ...prev, ...mappedAddress }));
                        return true;
                    }
                } catch (err) {
                    console.error("Auto-fill: Failed to fetch user profile", err);
                }
                return true;
            }
            return false;
        };

        const attemptFetch = async () => {
            const success = await fetchUserData();
            if (!success && attempts < maxAttempts) {
                attempts++;
                setTimeout(attemptFetch, 500);
            }
        };

        attemptFetch();
    }, [contextUserId]);


    // Handle Input Change
    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'phone') {
            const val = e.target.value.replace(/\D/g, '');
            if (val.length <= 10) setShippingAddress({ ...shippingAddress, phone: val });
        } else {
            setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
        }
    };

    const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'phone') {
            const val = e.target.value.replace(/\D/g, '');
            if (val.length <= 10) setBillingAddress({ ...billingAddress, phone: val });
        } else {
            setBillingAddress({ ...billingAddress, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const handleProcessPayment = async () => {
        const finalBillingAddress = sameAsShipping ? shippingAddress : billingAddress;

        // Generate Order ID locally
        const orderId = `ORD-${Date.now()}`;

        const orderData = {
            shippingAddress,
            billingAddress: finalBillingAddress,
            orderNotes,
            items: cartItems,
            totals: { cartTotal, shippingCost, taxAmount, grandTotal },
            paymentMethod: 'Online',
            userId: userId || 'guest', // Will resolve guest logic after payment
            orderDate: new Date().toISOString(),
            orderid: orderId,
            id: orderId,
            username: finalBillingAddress.name,
            useremail: finalBillingAddress.email,
            userphone: finalBillingAddress.phone
        };
        console.log("tempOrderData", orderData);
        // Store order data temporarily for Payment Page
        secureLocalStorage.setItem('tempOrderData', orderData);

        setShowConfirmation(false);

        // Redirect to Payment Page
        // Redirect to Payment Page
        const rawParams = {
            amount: grandTotal.toString(),
            orderid: orderId,
            name: finalBillingAddress.name,
            email: finalBillingAddress.email,
            phone: finalBillingAddress.phone
        };

        const encryptedData = encryptParams(rawParams);

        // We use 'q' as the query param for the encrypted payload
        window.location.href = `/shop/payment?q=${encodeURIComponent(encryptedData)}`;
    };

    if (cartItems.length === 0) {
        return (
            <div className="container-custom py-20 text-center">
                <h1 className="text-3xl font-heading font-bold mb-4">Your Cart is Empty</h1>
                <Link href="/shop" className="btn btn-primary">
                    Return to Shop
                </Link>
            </div>
        );
    }

    const finalBillingAddress = sameAsShipping ? shippingAddress : billingAddress;

    return (
        <div className="container-custom py-12 relative">
            <h1 className="text-3xl font-heading font-bold mb-8 text-center lg:text-left">Checkout</h1>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12">

                {/* Left Column: Forms */}
                <div className="flex-1 space-y-8">

                    {/* Shipping Address */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                            Shipping Address
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Full Name" name="name" value={shippingAddress.name} onChange={handleShippingChange} placeholder="e.g. John Doe" required={true} />
                            <InputField
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]{10}"
                                maxLength={10}
                                value={shippingAddress.phone}
                                onChange={handleShippingChange}
                                placeholder="e.g. 9876543210"
                                required={true}
                            />
                            <InputField label="Email Address" name="email" type="email" value={shippingAddress.email} onChange={handleShippingChange} placeholder="e.g. john@example.com" className="md:col-span-2" required={true} />
                            <InputField label="Address" name="address" value={shippingAddress.address} onChange={handleShippingChange} placeholder="House No, Street, Area" className="md:col-span-2" required={true} />
                            <InputField label="City" name="city" value={shippingAddress.city} onChange={handleShippingChange} placeholder="e.g. Bengaluru" required={true} />
                            <InputField label="Pincode" name="pincode" value={shippingAddress.pincode} onChange={handleShippingChange} placeholder="e.g. 560001" required={true} />
                            <InputField label="State" name="state" value={shippingAddress.state} onChange={handleShippingChange} placeholder="e.g. Karnataka" className="md:col-span-2" required={true} />
                        </div>
                    </div>

                    {/* Billing Address Toggle */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                            Billing Address
                        </h2>

                        <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors bg-gray-50/50">
                            <input
                                type="checkbox"
                                checked={sameAsShipping}
                                onChange={() => setSameAsShipping(!sameAsShipping)}
                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                            <span className="font-medium text-gray-700">Same as shipping address</span>
                        </label>

                        {!sameAsShipping && (
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                                <InputField label="Full Name" name="name" value={billingAddress.name} onChange={handleBillingChange} placeholder="e.g. John Doe" required={true} />
                                <InputField
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    value={billingAddress.phone}
                                    onChange={handleBillingChange}
                                    placeholder="e.g. 9876543210"
                                    required={true}
                                />
                                <InputField label="Email Address" name="email" type="email" value={billingAddress.email} onChange={handleBillingChange} placeholder="e.g. john@example.com" className="md:col-span-2" required={true} />
                                <InputField label="Address" name="address" value={billingAddress.address} onChange={handleBillingChange} placeholder="House No, Street, Area" className="md:col-span-2" required={true} />
                                <InputField label="City" name="city" value={billingAddress.city} onChange={handleBillingChange} placeholder="e.g. Bengaluru" required={true} />
                                <InputField label="Pincode" name="pincode" value={billingAddress.pincode} onChange={handleBillingChange} placeholder="e.g. 560001" required={true} />
                                <InputField label="State" name="state" value={billingAddress.state} onChange={handleBillingChange} placeholder="e.g. Karnataka" className="md:col-span-2" required={true} />
                            </div>
                        )}
                    </div>

                    {/* Order Notes */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
                            Additional Information
                        </h2>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Order Notes (Optional)</label>
                            <textarea
                                placeholder="Notes about your order, e.g. special notes for delivery."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-gray-400 h-32 resize-none"
                                value={orderNotes}
                                onChange={(e) => setOrderNotes(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="w-full lg:w-96">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-24">
                        <h2 className="text-lg font-bold font-heading mb-4">Your Order</h2>

                        {/* Items List */}
                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-3 text-sm">
                                    <div className="w-12 h-12 rounded bg-white flex-shrink-0 border border-gray-200 overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900 line-clamp-2">{item.name}</div>
                                        <div className="text-gray-500">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</div>
                                    </div>
                                    <div className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="space-y-3 py-4 border-t border-gray-200 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>{shippingCost === 0 ? <span className="text-green-600 font-medium">Free</span> : `₹${shippingCost}`}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax ({config.taxpercentage}%)</span>
                                <span>₹{taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-gray-900 border-t border-gray-200 pt-3">
                                <span>Total</span>
                                <span>₹{grandTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-2">Payment Method</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Online Payment (Netbanking / UPI / Cards)
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                Secure payment processing via Razorpay.
                            </p>
                        </div>

                        <button type="submit" className="btn btn-primary w-full mt-6 py-4 shadow-lg hover:shadow-xl transition-all">
                            Proceed to Confirm
                        </button>
                    </div>
                </div>
            </form>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-slideUp">

                        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold font-heading text-gray-900">Confirm Your Order</h2>
                            <button onClick={() => setShowConfirmation(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <span className="text-2xl leading-none">&times;</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">

                            {/* User Info */}
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-3">Customer Details</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-gray-500 text-xs">Name</span>
                                        <span className="font-medium text-gray-900">{userId ? shippingAddress.name : finalBillingAddress.name}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-xs">Email</span>
                                        <span className="font-medium text-gray-900">{userId ? shippingAddress.email : finalBillingAddress.email}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-xs">Phone</span>
                                        <span className="font-medium text-gray-900">{userId ? shippingAddress.phone : finalBillingAddress.phone}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-xs">User Type</span>
                                        <span className="font-medium text-gray-900">{userId ? `Registered (${userId.substring(0, 6)}...)` : 'Guest Checkout'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Shipping */}
                                <div className="border border-gray-100 rounded-xl p-4">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Shipping To</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        <span className="font-bold block text-gray-900 mb-1">{shippingAddress.name}</span>
                                        {shippingAddress.address}<br />
                                        {shippingAddress.city}, {shippingAddress.state}<br />
                                        {shippingAddress.pincode}<br />
                                        Phone: {shippingAddress.phone}
                                    </p>
                                </div>

                                {/* Billing */}
                                <div className="border border-gray-100 rounded-xl p-4">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Billing Address</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        <span className="font-bold block text-gray-900 mb-1">{finalBillingAddress.name}</span>
                                        {finalBillingAddress.address}<br />
                                        {finalBillingAddress.city}, {finalBillingAddress.state}<br />
                                        {finalBillingAddress.pincode}<br />
                                        Phone: {finalBillingAddress.phone}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                                    <span>Date</span>
                                    <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-2">
                                    <span className="text-lg font-bold text-gray-900">Total Payable Amount</span>
                                    <span className="text-2xl font-bold text-primary">₹{grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col-reverse md:flex-row gap-4 justify-end">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                            >
                                Cancel / Edit
                            </button>
                            <button
                                onClick={handleProcessPayment}
                                className="px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                Process to Payment ₹{grandTotal.toFixed(2)}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
