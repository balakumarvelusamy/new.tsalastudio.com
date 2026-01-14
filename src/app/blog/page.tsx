
import React from 'react';
import Link from 'next/link';
import { getItemsByType } from '../../services/api';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import BlurImage from '../../components/Element/BlurImage';

export const metadata = {
    title: 'Our Blog | Tsala Studio',
    description: 'Read our latest articles, tutorials, and updates.',
};

export default async function BlogPage(props: { searchParams?: Promise<{ q?: string; page?: string; category?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.q?.toLowerCase() || '';
    const page = Number(searchParams?.page) || 1;
    const category = searchParams?.category || 'All';
    const ITEMS_PER_PAGE = 9;

    // 1. Get all unique categories from blog posts
    // Fetch active blog posts from API
    const allBlogs = await getItemsByType('blog');
    const blogPosts = Array.isArray(allBlogs) ? allBlogs.filter((post: any) =>
        post.isactive === 1 && post.published === 1
    ) : [];

    const categories = ['All', ...Array.from(new Set(blogPosts.map((post: any) => post.postcategory || 'Uncategorized').filter(Boolean)))];

    // 2. Filter posts
    const filteredPosts = blogPosts.filter((post: any) => {
        // Category Filter
        if (category !== 'All' && (post.postcategory || 'Uncategorized') !== category) {
            return false;
        }

        // Search Filter
        const matchesQuery = post.posttitle.toLowerCase().includes(query) ||
            (post.postcontent && post.postcontent.toLowerCase().includes(query));

        return matchesQuery;
    });

    const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div>
            {/* Banner */}
            <div className="relative py-24 text-center text-white overflow-hidden bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        src="/images/banner.jpg"
                        alt="Banner"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />

                <div className="relative z-10 container-custom">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Blog</h1>
                    <div className="flex justify-center gap-2 text-sm uppercase tracking-wider text-gray-300">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <span>Blog</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="section-padding bg-gray-50">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Sidebar */}
                        <div className="lg:w-1/4 space-y-8">

                            {/* Search */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-heading font-bold text-lg mb-4">Search</h3>
                                <form className="relative">
                                    <input
                                        type="text"
                                        name="q"
                                        defaultValue={searchParams?.q || ''}
                                        placeholder="Search articles..."
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                                    />
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    {category !== 'All' && <input type="hidden" name="category" value={category} />}
                                </form>
                            </div>

                            {/* Categories */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-heading font-bold text-lg mb-4">Categories</h3>
                                <ul className="space-y-2">
                                    {categories.map((cat: any) => (
                                        <li key={cat}>
                                            <Link
                                                href={`/blog?${new URLSearchParams({
                                                    ...(searchParams?.q ? { q: searchParams.q } : {}),
                                                    category: cat
                                                }).toString()}`}
                                                className={`block px-3 py-2 rounded-md text-sm transition-colors ${category === cat
                                                    ? 'bg-primary/5 text-primary font-semibold'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                                                    }`}
                                            >
                                                {cat}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Blog Grid */}
                        <div className="lg:w-3/4">
                            {paginatedPosts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {paginatedPosts.map((post: any) => (
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            key={post.post_id}
                                            className="block group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border border-gray-100"
                                        >
                                            <div className="h-56 overflow-hidden relative">
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
                                                {post.post_image ? (
                                                    <BlurImage
                                                        src={post.post_image}
                                                        alt={post.posttitle}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                        No Image
                                                    </div>
                                                )}

                                                {post.postcategory && (
                                                    <span className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                                                        {post.postcategory}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                                    <span>{post.displaydate}</span>
                                                    <span>•</span>
                                                    <span>{post.createdby || 'Admin'}</span>
                                                </div>

                                                <h3 className="text-xl font-bold font-heading mb-3 group-hover:text-primary transition-colors leading-tight">
                                                    {post.posttitle}
                                                </h3>

                                                <div
                                                    className="text-gray-600 mb-6 text-sm line-clamp-3 leading-relaxed flex-1"
                                                    dangerouslySetInnerHTML={{ __html: post.postcontent }}
                                                />

                                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-primary font-bold text-sm">
                                                    Read Article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <div className="text-4xl mb-4">🔍</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
                                    <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                                    {(query || category !== 'All') && (
                                        <Link href="/blog" className="mt-6 inline-block px-6 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm font-medium">
                                            Clear Filters
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex justify-center gap-2">
                                    {/* Previous */}
                                    {page > 1 && (
                                        <Link
                                            href={`/blog?${new URLSearchParams({
                                                ...(searchParams?.q ? { q: searchParams.q } : {}),
                                                ...(category !== 'All' ? { category } : {}),
                                                page: (page - 1).toString()
                                            }).toString()}`}
                                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-white hover:border-primary/30 hover:text-primary transition-all text-gray-500 bg-white"
                                        >
                                            ←
                                        </Link>
                                    )}

                                    {/* Pages */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <Link
                                            key={p}
                                            href={`/blog?${new URLSearchParams({
                                                ...(searchParams?.q ? { q: searchParams.q } : {}),
                                                ...(category !== 'All' ? { category } : {}),
                                                page: p.toString()
                                            }).toString()}`}
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all font-medium ${p === page
                                                ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                                                : 'border-gray-200 bg-white text-gray-600 hover:border-primary/30 hover:text-primary'
                                                }`}
                                        >
                                            {p}
                                        </Link>
                                    ))}

                                    {/* Next */}
                                    {page < totalPages && (
                                        <Link
                                            href={`/blog?${new URLSearchParams({
                                                ...(searchParams?.q ? { q: searchParams.q } : {}),
                                                ...(category !== 'All' ? { category } : {}),
                                                page: (page + 1).toString()
                                            }).toString()}`}
                                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-white hover:border-primary/30 hover:text-primary transition-all text-gray-500 bg-white"
                                        >
                                            →
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
