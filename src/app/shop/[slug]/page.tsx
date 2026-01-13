
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import productsData from '../../../data/products.json';
import config from '../../../config.json';
import type { Metadata } from 'next';

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

// Helper to find product by slug (ID-Name pattern)
function findProductBySlug(slug: string): Product | undefined {
    // We expect the slug to start with the ID. 
    // Since IDs can contain hyphens, we look for the product where the slug STARTS with the ID.
    return productsData.find((p: any) => slug.startsWith(String(p.p_id))) as Product | undefined;
}

// 1. Generate Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = findProductBySlug(slug);

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
    const product = findProductBySlug(slug);

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
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Image Section */}
                        <div className="relative aspect-square bg-gray-100">
                            {product.p_image ? (
                                <img
                                    src={product.p_image}
                                    alt={product.p_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-gray-300">No Image</div>
                            )}
                            {discountPercentage > 0 && (
                                <div className="absolute top-6 left-6 bg-red-500 text-white font-bold py-1 px-3 rounded-full shadow-lg">
                                    -{discountPercentage}% OFF
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="p-8 md:p-12 flex flex-col h-full">
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {product.p_category}
                                    </span>
                                    {product.p_subcategory && (
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {product.p_subcategory}
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                                    {product.p_name}
                                </h1>

                                <div className="flex items-baseline gap-4 mb-6">
                                    <span className="text-4xl font-bold text-primary">₹{product.p_price}</span>
                                    {product.p_actual_price && Number(product.p_actual_price) > Number(product.p_price) && (
                                        <>
                                            <span className="text-xl text-gray-400 line-through">₹{product.p_actual_price}</span>
                                            <span className="text-green-500 font-bold text-sm">Save ₹{Number(product.p_actual_price) - Number(product.p_price)}</span>
                                        </>
                                    )}
                                </div>

                                {product.p_quantity && (
                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg inline-block">
                                        <span className="text-sm text-gray-500 uppercase tracking-wide block mb-1">Quantity/Unit</span>
                                        <span className="font-bold text-gray-900">{product.p_quantity}</span>
                                    </div>
                                )}

                                <p className="text-gray-600 text-sm italic mb-8">
                                    Includes all taxes. Shipping calculated at checkout.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                    <a
                                        href={`https://wa.me/919880162266?text=Hi, I am interested in buying ${product.p_name} (ID: ${product.p_id})`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary flex-1 text-center py-4 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                        <span>Buy on WhatsApp</span>
                                    </a>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-auto border-t border-gray-100 pt-8">
                                <h3 className="text-lg font-bold font-heading mb-4 text-gray-900">Product Description</h3>
                                <div
                                    className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: product.p_description }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
