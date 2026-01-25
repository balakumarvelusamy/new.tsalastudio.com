import React from 'react';
import { getItemsByType } from '../../../services/api';
import OrderListClient from './OrderListClient';

export default async function AdminOrdersPage() {
    // Fetch orders from API
    // getItemsByType('order') returns all orders
    const orders = await getItemsByType('order');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold font-heading">Manage Orders</h1>
            </div>

            <OrderListClient initialOrders={orders} />
        </div>
    );
}
