'use client';
import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import Link from 'next/link';
import config from '../../../config.json';

interface AddressForm {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}

const InputField = ({ label, name, type = "text", value, onChange, placeholder, required = true, className = "" }: any) => (
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
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-gray-400"
        />
    </div>
);

export default function CheckoutPage() {
    const { cartItems, cartTotal, shippingCost, taxAmount, grandTotal } = useCart();

    // Form States
    const [shippingAddress, setShippingAddress] = useState<AddressForm>({
        name: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
    });

    const [billingAddress, setBillingAddress] = useState<AddressForm>({
        name: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
    });

    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [orderNotes, setOrderNotes] = useState('');

    // Handle Input Change
    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBillingAddress({ ...billingAddress, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalBillingAddress = sameAsShipping ? shippingAddress : billingAddress;

        const orderData = {
            shippingAddress,
            billingAddress: finalBillingAddress,
            orderNotes,
            items: cartItems,
            totals: { cartTotal, shippingCost, taxAmount, grandTotal },
            paymentMethod: 'Online'
        };

        console.log("Order Submitted:", orderData);
        alert("Order placed successfully! (Mock)");
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

    return (
        <div className="container-custom py-12">
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
                            <InputField label="Phone Number" name="phone" value={shippingAddress.phone} onChange={handleShippingChange} placeholder="e.g. 9876543210" required={true} />
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
                                <InputField label="Phone Number" name="phone" value={billingAddress.phone} onChange={handleBillingChange} placeholder="e.g. 9876543210" required={true} />
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
                            Place Order
                        </button>
                    </div>
                </div>
            </form>

        </div>
    );
}
