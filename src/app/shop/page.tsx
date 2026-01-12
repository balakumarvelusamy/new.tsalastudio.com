import React from 'react';
import Sidebar from '@/components/shop/Sidebar';
import ProductCard from '@/components/shop/ProductCard';
import config from '../../config.json';

// Types
interface Product {
    p_id: string;
    p_name: string;
    p_image: string;
    p_price: number | string;
    p_actual_price?: number | string;
    isactive: string | number;
    p_category: string;
}

interface Category {
    category: string;
    type: string;
}

// Fetchers
async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${config.service_url}getproducts`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.filter((p: any) => p.isactive === '1' || p.isactive === 1);
}

async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${config.service_url}getuserscategory`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status === 200) {
        return data.data.filter((d: any) => d.type === 'product'); // ensuring only product categories
    }
    return [];
}

export const metadata = {
    title: 'Shop | Tsala Studio',
    description: 'Shop for quilting supplies, fabrics, and kits.',
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const { category } = await searchParams; // Next.js 15: searchParams is a promise
    const productsData = getProducts();
    const categoriesData = getCategories();

    const [allProducts, categories] = await Promise.all([productsData, categoriesData]);

    // Filter products on server
    const filteredProducts = category
        ? allProducts.filter((p) => p.p_category === category)
        : allProducts;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Banner */}
            <div className="relative py-24 text-center text-white mb-12 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/banner.jpg"
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-heading font-bold">Shop</h1>
                    <p className="text-indigo-200 mt-2">Find the best materials for your craft</p>
                </div>
            </div>

            <div className="container-custom">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <Sidebar categories={categories} />

                    {/* Main Content */}
                    <div className="w-full lg:w-3/4">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.p_id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                                <p className="text-gray-500 text-lg">No products found in this category.</p>
                                <a href="/shop" className="text-secondary hover:underline mt-2 inline-block">View All Products</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
