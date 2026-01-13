
import React from 'react';
import ShopClient from './ShopClient';
import { getItemsByType } from '../../services/api';

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request

export default async function ShopPage() {
    // Fetch products from DynamoDB via API
    const products = await getItemsByType('product');

    return (
        <ShopClient products={products} />
    );
}
