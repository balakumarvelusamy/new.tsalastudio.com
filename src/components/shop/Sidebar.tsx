'use client';
import Link from 'next/link';
import React from 'react';
import { useSearchParams } from 'next/navigation';

interface Category {
    category: string;
    type: string;
}

const Sidebar = ({ categories }: { categories: Category[] }) => {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');

    return (
        <aside className="w-full lg:w-1/4 space-y-8">
            {/* Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-heading font-bold mb-4 border-b pb-2">Categories</h3>
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/shop"
                            className={`block px-3 py-2 rounded-lg transition-colors ${!currentCategory ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            All Products
                        </Link>
                    </li>
                    {categories.map((cat, idx) => (
                        <li key={idx}>
                            <Link
                                href={`/shop?category=${encodeURIComponent(cat.category)}`}
                                className={`block px-3 py-2 rounded-lg transition-colors ${currentCategory === cat.category ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                {cat.category}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price filter placeholder - Logic needs to be implemented in Page if URL based, or client side state */}
            {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
         <h3 className="text-lg font-heading font-bold mb-4 border-b pb-2">Price Filter</h3>
         <p className="text-sm text-gray-500">Coming soon</p>
      </div> */}
        </aside>
    );
};

export default Sidebar;
