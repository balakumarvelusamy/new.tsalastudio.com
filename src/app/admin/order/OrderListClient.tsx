'use client';

import React, { useState } from 'react';
import { EyeIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { saveItem, deleteItem } from '../../../services/api'; // Adjust path if needed
import config from '../../../config.json';

export default function OrderListClient({ initialOrders }: { initialOrders: any[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [loadingAction, setLoadingAction] = useState(false);
    const [statusUpdate, setStatusUpdate] = useState('');

    const filteredOrders = orders.filter(order =>
        order.orderid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort by date descending
    filteredOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

    const openOrder = (order: any) => {
        setSelectedOrder(order);
        setStatusUpdate(order.orderstatus || 'Received');
    };

    const closeOrder = () => {
        setSelectedOrder(null);
        setLoadingAction(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this order? This cannot be undone.')) return;

        setLoadingAction(true);
        try {
            await deleteItem(id);
            setOrders(orders.filter(o => o.id !== id));
            closeOrder();
            alert('Order deleted successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to delete order');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder) return;
        setLoadingAction(true);

        try {
            const updatedOrder = {
                ...selectedOrder,
                orderstatus: statusUpdate
            };

            await saveItem(updatedOrder);

            // Update local state
            setOrders(orders.map(o => o.id === selectedOrder.id ? updatedOrder : o));
            setSelectedOrder(updatedOrder);

            // Send Email Notification
            await sendStatusEmail(updatedOrder, statusUpdate);

            alert('Order status updated and email sent.');
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        } finally {
            setLoadingAction(false);
        }
    };

    const sendStatusEmail = async (order: any, newStatus: string) => {
        const email = order.shippingAddress?.email || order.useremail;
        if (!email) return;

        const body = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2>Order Status Update</h2>
                <p>Hello ${order.username || 'Customer'},</p>
                <p>Your order <strong>${order.orderid}</strong> status has been updated to:</p>
                <h3 style="color: #d4a574;">${newStatus}</h3>
                <p>Thank you for shopping with Tsala Studio.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888;">If you have any questions, please contact us.</p>
            </div>
        `;

        try {
            await fetch(config.email_service_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    from: config.fromemail,
                    to: (config as any).env === 'test' ? email : `${email},${config.fromemail}`,
                    subject: `Order Updated - ${order.orderid}`,
                    text: `Order ${order.orderid} status updated to ${newStatus}`,
                    html: body,
                }),
            });
        } catch (e) {
            console.error("Failed to send email", e);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex gap-4">
                <input
                    type="text"
                    placeholder="Search Order ID, Name, Email..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Payment</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => openOrder(order)}>
                                    <td className="px-6 py-4 text-gray-900 font-medium text-sm">
                                        {order.orderid}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        <div className="font-medium text-gray-900">{order.shippingAddress?.name || 'N/A'}</div>
                                        <div className="text-xs text-gray-400">{order.shippingAddress?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                                        {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 font-medium text-sm">
                                        ₹{order.totals?.grandTotal?.toFixed(2) || '0.00'}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${order.orderstatus === 'Received' ? 'bg-green-100 text-green-700' :
                                            order.orderstatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {order.orderstatus || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${order.paymentstatus === 'Completed' ? 'bg-green-100 text-green-700' :
                                            order.paymentstatus === 'Failed' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.paymentstatus || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-gray-100 rounded-full text-blue-500">
                                            <EyeIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                Showing {filteredOrders.length} orders
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-xl font-bold font-heading text-gray-900">Order {selectedOrder.orderid}</h2>
                                <p className="text-sm text-gray-500">Placed on {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                            </div>
                            <button onClick={closeOrder} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <XMarkIcon className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8">

                            {/* Actions Bar */}
                            <div className="bg-gray-50 p-4 rounded-xl flex flex-wrap gap-4 justify-between items-center border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-700">Status:</span>
                                    <select
                                        value={statusUpdate}
                                        onChange={(e) => setStatusUpdate(e.target.value)}
                                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Received">Received</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <button
                                        onClick={handleUpdateStatus}
                                        disabled={loadingAction}
                                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        {loadingAction ? 'Updating...' : 'Update & Notify'}
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleDelete(selectedOrder.id)}
                                    disabled={loadingAction}
                                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center gap-2 border border-transparent hover:border-red-100"
                                >
                                    <TrashIcon className="w-4 h-4" /> Delete Order
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Details Left Col */}
                                <div className="space-y-6">
                                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                                        <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Customer Details</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="text-gray-500 w-24 inline-block">Name:</span> {selectedOrder.shippingAddress?.name}</p>
                                            <p><span className="text-gray-500 w-24 inline-block">Email:</span> {selectedOrder.shippingAddress?.email}</p>
                                            <p><span className="text-gray-500 w-24 inline-block">Phone:</span> {selectedOrder.shippingAddress?.phone}</p>
                                            <p><span className="text-gray-500 w-24 inline-block">User ID:</span> {selectedOrder.userId}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                                        <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Payment Info</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="text-gray-500 w-24 inline-block">Status:</span>
                                                <span className={`px-2 py-0.5 rounded text-xs ml-2 font-bold ${selectedOrder.paymentstatus === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {selectedOrder.paymentstatus}
                                                </span>
                                            </p>
                                            <p><span className="text-gray-500 w-24 inline-block">Method:</span> {selectedOrder.paymentmethod}</p>
                                            <p><span className="text-gray-500 w-24 inline-block">Pay ID:</span> {selectedOrder.authid || 'N/A'}</p>
                                            <p><span className="text-gray-500 w-24 inline-block">Order ID:</span> {selectedOrder.razororderid || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Right Col */}
                                <div className="space-y-6">
                                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                                        <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Shipping Address</h3>
                                        <div className="text-sm text-gray-600 leading-relaxed">
                                            <p className="font-bold text-gray-900">{selectedOrder.shippingAddress?.name}</p>
                                            <p>{selectedOrder.shippingAddress?.address}</p>
                                            <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                                            <p>{selectedOrder.shippingAddress?.pincode}</p>
                                            <p>Phone: {selectedOrder.shippingAddress?.phone}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                                        <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Billing Address</h3>
                                        <div className="text-sm text-gray-600 leading-relaxed">
                                            <p className="font-bold text-gray-900">{selectedOrder.billingAddress?.name}</p>
                                            <p>{selectedOrder.billingAddress?.address}</p>
                                            <p>{selectedOrder.billingAddress?.city}, {selectedOrder.billingAddress?.state}</p>
                                            <p>{selectedOrder.billingAddress?.pincode}</p>
                                            <p>Phone: {selectedOrder.billingAddress?.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                <h3 className="font-bold text-gray-900 p-5 bg-gray-50 border-b border-gray-100">Order Items</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                                            <tr>
                                                <th className="px-6 py-3">Product</th>
                                                <th className="px-6 py-3 text-center">Qty</th>
                                                <th className="px-6 py-3 text-right">Price</th>
                                                <th className="px-6 py-3 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm">
                                            {selectedOrder.items?.map((item: any, idx: number) => (
                                                <tr key={idx}>
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        <div className="flex items-center gap-3">
                                                            {item.image && <img src={item.image} className="w-10 h-10 rounded object-cover border border-gray-100" />}
                                                            {item.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">{item.quantity}</td>
                                                    <td className="px-6 py-4 text-right">₹{item.price}</td>
                                                    <td className="px-6 py-4 text-right font-bold">₹{item.price * item.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50/50 text-sm font-medium">
                                            <tr>
                                                <td colSpan={3} className="px-6 py-3 text-right text-gray-500">Subtotal</td>
                                                <td className="px-6 py-3 text-right">₹{selectedOrder.totals?.cartTotal?.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3} className="px-6 py-3 text-right text-gray-500">Shipping</td>
                                                <td className="px-6 py-3 text-right">₹{selectedOrder.totals?.shippingCost?.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3} className="px-6 py-3 text-right text-gray-500">Tax</td>
                                                <td className="px-6 py-3 text-right">₹{selectedOrder.totals?.taxAmount?.toFixed(2)}</td>
                                            </tr>
                                            <tr className="text-primary font-bold text-base">
                                                <td colSpan={3} className="px-6 py-4 text-right">Grand Total</td>
                                                <td className="px-6 py-4 text-right">₹{selectedOrder.totals?.grandTotal?.toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
