
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getItemBySlug } from '../../../services/api';
import config from '../../../config.json';
import type { Metadata } from 'next';
import ProductDetail from '../../../components/shop/ProductDetail';

interface Product {
    p_id: string;
    p_name: string;
    p_price: string;
    p_actual_price: string;
    p_image: string;
    p_category: string;
    p_subcategory: string;
    p_description: string;
    p_quantity: string;
    createddate: string;
}

// Data Helper - Normalize to array
function normalizeData(data: any): any[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return [data];
}

// 1. Generate Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const data = await getItemBySlug(slug);
    const products = normalizeData(data);
    const product = products[0];

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    const plainDescription = product.p_description?.replace(/<[^>]+>/g, '').slice(0, 160) || 'Product Details';

    return {
        title: `${product.p_name} | Tsala Studio`,
        description: plainDescription,
        openGraph: {
            title: product.p_name,
            description: plainDescription,
            images: [product.p_image],
            url: `${config.domain}/shop/${slug}`,
            type: 'website',
        },
    };
}

// 2. Page Component
export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const rawData = await getItemBySlug(slug);
    const products = normalizeData(rawData);
    const product = products[0];

    if (!product) {
        notFound();
    }

    const discountPercentage = product.p_actual_price && Number(product.p_actual_price) > Number(product.p_price)
        ? Math.round(((Number(product.p_actual_price) - Number(product.p_price)) / Number(product.p_actual_price)) * 100)
        : 0;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="container-custom flex text-sm text-gray-500 uppercase tracking-wide">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/shop" className="hover:text-primary">Shop</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 truncate max-w-xs">{product.p_name}</span>
                </div>
            </div>

            <div className="container-custom py-12">
                <ProductDetail product={{
                    id: product.id || product.p_id, // Ensure ID is passed
                    p_id: product.p_id,
                    p_name: product.p_name,
                    p_image: product.p_image,
                    p_price: product.p_price,
                    p_description: product.p_description,
                    p_quantity: Number(product.p_quantity || 0),
                    moreimageurl: [] // Add if available in product data
                }} reviews={[]} relatedProducts={[]} />
            </div>
        </div>
    );
}
