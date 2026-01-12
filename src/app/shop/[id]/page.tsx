import React from 'react';
import ProductDetail from '@/components/shop/ProductDetail';
import ProductCard from '@/components/shop/ProductCard';
import config from '../../../config.json';
import Link from 'next/link';

// Fetchers
async function getProduct(id: string) {
    const res = await fetch(`${config.service_url}getproductbyId/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
}

async function getReviews(id: string) {
    const res = await fetch(`${config.service_url}getProductReviews/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
}

async function getRelatedProducts(category: string) {
    if (!category) return [];
    const res = await fetch(`${config.service_url}getRelatedProducts/${category}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);
    // Remove "await" from `await params` above if conflict, but NextJS 15 usually requires it or not. The type says Promise so default is await
    return {
        title: product ? `${product.p_name} | Tsala Studio` : 'Product Not Found',
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return (
            <div className="container-custom py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Product not found</h1>
                <Link href="/shop" className="btn btn-primary">Back to Shop</Link>
            </div>
        );
    }

    // Parallel fetch reviews and related
    const [reviews, related] = await Promise.all([
        getReviews(id),
        getRelatedProducts(product.p_category)
    ]);

    return (
        <div className="bg-white min-h-screen pb-20 pt-8">
            <div className="container-custom">
                {/* Breadcrumbs */}
                <div className="mb-8 flex gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-primary">Shop</Link>
                    <span>/</span>
                    <span className="text-gray-900 line-clamp-1">{product.p_name}</span>
                </div>

                <ProductDetail product={product} reviews={reviews} relatedProducts={related} />

                {/* Related Products */}
                {related && related.length > 0 && (
                    <div className="mt-20 border-t pt-12">
                        <h2 className="text-2xl font-heading font-bold mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {related.slice(0, 4).map((p: any) => (
                                <ProductCard key={p.p_id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
