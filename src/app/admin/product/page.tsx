import React from 'react';
import { getItemsByType } from '../../../services/api';
import ProductListClient from './ProductListClient';

export default async function AdminProductsPage() {
    // Fetch products from API
    // The migration tool sets type='product' for migrated items.
    const products = await getItemsByType('product');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold font-heading">Manage Products</h1>
            </div>

            <ProductListClient initialProducts={products} />
        </div>
    );
}
