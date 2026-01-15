'use client';
import React from 'react';
import { useCart } from '../../../context/CartContext';
import { TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import config from '../../../config.json';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, shippingCost, taxAmount, grandTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="container-custom py-20 text-center">
                <h1 className="text-3xl font-heading font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
                <Link href="/shop" className="btn btn-primary">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container-custom py-8 md:py-12 pb-32 md:pb-12"> {/* Added pb-32 for mobile bottom bar space */}
            <h1 className="text-2xl md:text-3xl font-heading font-bold mb-6 md:mb-8">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items Section */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                        {/* Desktop Table View */}
                        <table className="w-full text-left hidden md:table">
                            <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-medium">
                                <tr>
                                    <th className="p-4">Product</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Quantity</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {cartItems.map((item) => (
                                    <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="font-semibold text-gray-900 line-clamp-2">{item.name}</div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            ₹{item.price.toFixed(2)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center border border-gray-200 rounded-lg w-max bg-white">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-3 py-1 hover:bg-gray-100 text-gray-500 transition-colors disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="px-2 font-medium w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-3 py-1 hover:bg-gray-100 text-gray-500 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-gray-900">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                                title="Remove Item"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Compact View */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {cartItems.map((item) => (
                                <div key={item.id} className="p-4 flex gap-4">
                                    {/* Image */}
                                    <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight pr-6">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 -mt-1 -mr-1 p-2"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end mt-2">
                                            <div className="flex items-center border border-gray-200 rounded-lg bg-white h-8">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2 hover:bg-gray-100 text-gray-500 disabled:opacity-50 h-full"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="px-1 font-medium text-sm w-6 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 hover:bg-gray-100 text-gray-500 h-full"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                {/* <div className="text-xs text-gray-500">₹{item.price} each</div> */}
                                                <div className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 text-right">
                        <button onClick={clearCart} className="text-sm text-red-500 hover:underline">
                            Clear Cart
                        </button>
                    </div>
                </div>

                {/* Desktop Summary Sidebar */}
                <div className="w-full lg:w-80 hidden md:block">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                        <h2 className="text-lg font-bold font-heading mb-4">Order Summary</h2>
                        <div className="space-y-3 mb-6 text-sm">
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
                            {cartTotal < config.freeshippingcost && (
                                <div className="text-xs text-gray-500 italic">
                                    Add items worth ₹{(config.freeshippingcost - cartTotal).toFixed(2)} more for free shipping
                                </div>
                            )}
                            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-gray-900">
                                <span>Total</span>
                                <span>₹{grandTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <Link href="/shop/checkout">
                            <button className="btn btn-primary w-full py-4 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                                Checkout
                            </button>
                        </Link>
                        <div className="mt-4 text-center">
                            <Link href="/shop" className="text-sm text-gray-500 hover:text-primary underline">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
                <div className="flex items-center justify-between gap-4 container-custom">
                    <div>
                        <div className="text-xs text-gray-500">Total (Inc. Tax & Ship)</div>
                        <div className="font-bold text-xl text-primary">₹{grandTotal.toFixed(2)}</div>
                    </div>
                    <Link href="/shop/checkout" className="flex-1 max-w-[200px]">
                        <button className="btn btn-primary w-full py-3 text-base shadow-lg">
                            Checkout
                        </button>
                    </Link>
                </div>
            </div>

            {/* Mobile Summary Details (Optional - placed below cart items to see breakdown if needed) */}
            <div className="md:hidden mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h2 className="text-base font-bold mb-3">Order Details</h2>
                <div className="space-y-2 text-sm">
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
                </div>
            </div>
        </div>
    );
}
