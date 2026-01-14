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
        <div className="container-custom py-12">
            <h1 className="text-3xl font-heading font-bold mb-8">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items Table */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
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
                    </div>

                    <div className="mt-4 text-right">
                        <button onClick={clearCart} className="text-sm text-red-500 hover:underline">
                            Clear Cart
                        </button>
                    </div>
                </div>

                {/* Summary */}
                <div className="w-full lg:w-80">
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
        </div>
    );
}
