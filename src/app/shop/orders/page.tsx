'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';
import { filterItems } from '../../../services/api';
import Link from 'next/link';

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            const uuid = secureLocalStorage.getItem('tsalauuid') as string;

            if (!uuid) {
                router.push('/login');
                return;
            }

            try {
                // Fetch orders for the logged-in user
                const data = await filterItems('userId', uuid, 'type', 'order');

                // Sort by ID (usually implies newer first if ID is timestamp based, or just random. 
                // Ideally sort by date if available. Assuming createddate is ISO string.)
                const sortedData = Array.isArray(data)
                    ? data.sort((a: any, b: any) => new Date(b.createddate).getTime() - new Date(a.createddate).getTime())
                    : [];

                setOrders(sortedData);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    if (loading) {
        return (
            <div className="container-custom py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="container-custom py-12">
            <h1 className="text-3xl font-heading font-bold mb-4">Order History</h1>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            In our new portal, you will see only orders after <span className="font-semibold">Feb 2026</span>.
                        </p>
                    </div>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
                    <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                    <Link href="/shop" className="btn btn-primary">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Desktop View */}
                    <table className="w-full text-left hidden md:table">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-medium">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>

                                <th className="p-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                    onClick={() => router.push(`/shop/orders/${order.id}`)}
                                >
                                    <td className="p-4 font-medium text-gray-900 group-hover:text-primary transition-colors">
                                        <span title={order.id}>#{order.id.substring(0, 8)}...</span>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {new Date(order.orderDate || order.createddate).toLocaleString('en-IN', {
                                            timeZone: 'Asia/Kolkata',
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${order.orderstatus === 'completed' ? 'bg-green-100 text-green-800' :
                                                order.orderstatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {order.orderstatus || 'Pending'}
                                        </span>
                                    </td>

                                    <td className="p-4 text-right">
                                        <div className="font-bold text-gray-900">
                                            {order.totals.grandTotal ? `₹${Number(order.totals.grandTotal).toFixed(2)}` : '-'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile View */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {orders.map((order) => (
                            <Link href={`/shop/orders/${order.id}`} key={order.id} className="block p-4 space-y-3 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-gray-900">Order #{order.id.substring(0, 8)}...</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(order.orderDate || order.createddate).toLocaleString('en-IN', {
                                                timeZone: 'Asia/Kolkata',
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </div>
                                    </div>
                                    <div className="font-bold text-primary">
                                        {order.grandTotal ? `₹${Number(order.grandTotal).toFixed(2)}` : '-'}
                                    </div>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                                        ${order.orderstatus === 'completed' ? 'bg-green-50 text-green-700 border border-green-100' :
                                            order.orderstatus === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                'bg-yellow-50 text-yellow-700 border border-yellow-100'}`}>
                                        {order.orderstatus || 'Pending'}
                                    </span>
                                    <span className="text-gray-500 flex items-center gap-1">
                                        {order.shippingstatus || 'Processing'}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
