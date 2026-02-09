'use client';
import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';
import { getItemsById } from '../../../../services/api';
import Link from 'next/link';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchOrder = async () => {
            const uuid = secureLocalStorage.getItem('tsalauuid') as string;

            if (!uuid) {
                router.push('/login');
                return;
            }

            try {
                // Fetch specific order
                const data = await getItemsById(id);
                console.log("Order Data:", data);

                if (!data) {
                    setError('Order not found');
                } else if (Array.isArray(data)) {
                    // Sometimes API returns array even for ID fetch if not exact match logic?? 
                    // Usually getItemsById returns single object or array depending on implementation.
                    // Let's handle both.
                    const found = data.find((item: any) => item.id === id);
                    if (found) {
                        // Security check: Verify order belongs to user
                        if (found.userId !== uuid) {
                            setError('Unauthorized access');
                        } else {
                            setOrder(found);
                        }
                    } else {
                        setError('Order not found');
                    }
                } else {
                    // Single object
                    if (data.id === id) {
                        if (data.userId !== uuid) {
                            setError('Unauthorized access');
                        } else {
                            setOrder(data);
                        }
                    } else {
                        setError('Order not found');
                    }
                }

            } catch (err) {
                console.error("Failed to fetch order details:", err);
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id, router]);

    if (loading) {
        return (
            <div className="container-custom py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading order details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-custom py-20 text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link href="/shop/orders" className="btn btn-secondary">
                    Back to Orders
                </Link>
            </div>
        );
    }

    if (!order) return null;

    const { shippingAddress, billingAddress, items, totals, paymentmethod, orderstatus, createddate, shippingstatus } = order;

    // Fallback logic for totals if missing
    const grandTotal = totals?.grandTotal || order.grandTotal || 0;
    const subTotal = totals?.cartTotal || 0; // If missing, we might need to recalc from items
    const shipping = totals?.shippingCost || 0;
    const tax = totals?.taxAmount || 0;

    return (
        <div className="container-custom py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <Link href="/shop/orders" className="text-sm text-gray-500 hover:text-primary mb-2 inline-block">
                        ← Back to Order History
                    </Link>
                    <h1 className="text-3xl font-heading font-bold">Order #{order.id}</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Placed on {new Date(order.orderDate || order.createddate).toLocaleString('en-IN', {
                            timeZone: 'Asia/Kolkata',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })}
                    </p>
                </div>
                <div className="flex gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold capitalize
                        ${orderstatus === 'completed' ? 'bg-green-100 text-green-800' :
                            orderstatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'}`}>
                        {orderstatus || 'Pending'}
                    </span>

                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items & Details */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Items */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="font-bold text-gray-900">Items Ordered</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {items && items.map((item: any, idx: number) => (
                                <div key={idx} className="p-6 flex gap-4 sm:gap-6">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                                        {item.itemType && (
                                            <span className="text-xs uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                {item.itemType}
                                            </span>
                                        )}
                                        <div className="mt-2 text-sm text-gray-500">
                                            Quantity: <span className="font-medium text-gray-900">{item.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900">₹{item.price.toFixed(2)}</div>
                                        <div className="text-xs text-gray-500 mt-1">Total: ₹{(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Information Mobile Only (Moved from right col on desktop) */}
                    <div className="lg:hidden space-y-8">
                        {/* Addresses */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Shipping Address</h2>
                            <div className="text-sm text-gray-600 leading-relaxed">
                                <p className="font-bold text-gray-900">{shippingAddress.name}</p>
                                <p>{shippingAddress.address}</p>
                                <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                                <p className="mt-2">Phone: {shippingAddress.phone}</p>
                                <p>Email: {shippingAddress.email}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Summary & Addresses */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="font-bold text-gray-900">Order Summary</h2>
                        </div>
                        <div className="p-6 space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{Number(subTotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>{Number(shipping) === 0 ? 'Free' : `₹${Number(shipping).toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span>₹{Number(tax).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-gray-900 border-t border-gray-100 pt-3 mt-3">
                                <span>Total</span>
                                <span className="text-primary">₹{Number(grandTotal).toFixed(2)}</span>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Payment Info</div>
                                <p className="text-sm text-gray-700">Method: <span className="font-medium">{paymentmethod || 'Online'}</span></p>
                                {order.razororderid && <p className="text-xs text-gray-500 mt-1">Ref: {order.razororderid}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Addresses Desktop */}
                    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="font-bold text-gray-900">Shipping Detail</h2>
                        </div>
                        <div className="p-6 text-sm text-gray-600 leading-relaxed">
                            <p className="font-bold text-gray-900">{shippingAddress.name}</p>
                            <p>{shippingAddress.address}</p>
                            <p>{shippingAddress.city}, {shippingAddress.state}</p>
                            <p>{shippingAddress.pincode}</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="flex items-center gap-2">
                                    <span className="text-gray-400">📱</span> {shippingAddress.phone}
                                </p>
                                <p className="flex items-center gap-2 mt-1">
                                    <span className="text-gray-400">✉️</span> {shippingAddress.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="font-bold text-gray-900">Billing Detail</h2>
                        </div>
                        <div className="p-6 text-sm text-gray-600 leading-relaxed">
                            <p className="font-bold text-gray-900">{billingAddress.name}</p>
                            <p>{billingAddress.address}</p>
                            <p>{billingAddress.city}, {billingAddress.state}</p>
                            <p>{billingAddress.pincode}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
