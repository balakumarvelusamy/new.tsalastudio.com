'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { useSearchParams } from 'next/navigation';

interface ShopClientProps {
    products: any[];
}

const ITEMS_PER_PAGE = 12;

export default function ShopClient({ products }: ShopClientProps) {
    const searchParamsHook = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>(searchParamsHook.get('category') || 'All');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('latest'); // latest, price-asc, price-desc
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Filter and Sort Data
    const { filteredProducts, categories } = useMemo(() => {
        let data = [...products];

        // Extract unique categories
        const uniqueCategories = ['All', ...Array.from(new Set(data.map(p => p.p_category).filter(Boolean)))];

        // Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter(p =>
                (p.p_name && p.p_name.toLowerCase().includes(lowerTerm)) ||
                (p.p_description && p.p_description.toLowerCase().includes(lowerTerm)) ||
                (p.posttitle && p.posttitle.toLowerCase().includes(lowerTerm)) // Fallback/Alternative
            );
        }

        // Filter Category
        if (selectedCategory !== 'All') {
            data = data.filter(p => p.p_category === selectedCategory);
        }

        // Sort
        if (sortBy === 'latest') {
            data.sort((a, b) => new Date(b.createddate).getTime() - new Date(a.createddate).getTime());
        } else if (sortBy === 'price-asc') {
            data.sort((a, b) => Number(a.p_price) - Number(b.p_price));
        } else if (sortBy === 'price-desc') {
            data.sort((a, b) => Number(b.p_price) - Number(a.p_price));
        }

        return { filteredProducts: data, categories: uniqueCategories };
    }, [searchTerm, selectedCategory, sortBy, products]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, sortBy]);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Banner */}
            <div className="relative py-20 text-center text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/banner.jpg" // Using standard banner
                        alt="Shop Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 container-custom">
                    <h1 className="text-5xl font-heading font-bold mb-4">Shop</h1>
                    <div className="flex justify-center gap-2 text-sm uppercase tracking-wider text-gray-300">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <span>/</span>
                        <span>Shop</span>
                    </div>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className={`lg:w-1/4 ${isMobileFiltersOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden lg:block'}`}>
                        <div className="flex justify-between items-center mb-6 lg:hidden">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2">
                                ✕
                            </button>
                        </div>

                        {/* Search */}
                        <div className="mb-8">
                            <h3 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Search</h3>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                            />
                        </div>

                        {/* Categories */}
                        <div className="mb-8">
                            <h3 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Categories</h3>
                            <ul className="space-y-2">
                                {categories.map(cat => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat
                                                ? 'bg-secondary text-white font-medium'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {cat as string}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden w-full flex justify-between items-center mb-4">
                        <button
                            onClick={() => setIsMobileFiltersOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                            <span>Filters</span>
                        </button>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none"
                        >
                            <option value="latest">Latest Added</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="hidden lg:flex justify-between items-center mb-6">
                            <p className="text-gray-500">Showing {filteredProducts.length} results</p>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-sm">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none text-sm"
                                >
                                    <option value="latest">Latest Added</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {paginatedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('All');
                                    }}
                                    className="mt-4 text-secondary font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                                {/* First Page */}
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-600"
                                    title="First Page"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                                </button>

                                {/* Previous */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-600 font-medium"
                                >
                                    Prev
                                </button>

                                {/* Page Numbers */}
                                {(() => {
                                    let start = Math.max(currentPage - 2, 1);
                                    let end = Math.min(start + 4, totalPages);

                                    // Adjust range if we are near the end
                                    if (end - start < 4) {
                                        start = Math.max(end - 4, 1);
                                    }

                                    // Adjust range if we are near the start (already handled by max 1, but ensuring end captures full 5 if available)
                                    if (totalPages >= 5 && end - start < 4) {
                                        end = Math.min(start + 4, totalPages);
                                    }

                                    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

                                    return pages.map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors ${currentPage === page
                                                ? 'bg-secondary text-white shadow-md'
                                                : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ));
                                })()}

                                {/* Next */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-600 font-medium"
                                >
                                    Next
                                </button>

                                {/* Last Page */}
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-600"
                                    title="Last Page"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
