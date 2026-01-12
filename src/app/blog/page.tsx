import React from 'react';
import { BlogCard, BlogSidebar } from '@/components/blog/BlogComponents';
import config from '../../config.json';
import Link from 'next/link';

async function getPosts() {
    const res = await fetch(`${config.service_url}getposts`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.filter((p: any) => p.isactive === 1 && p.published === 1 && p.posttypevalue === 'Blog');
}

async function getRecentPosts() {
    const res = await fetch(`${config.service_url}getrecentposts`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data
        .filter((p: any) => p.isactive === 1 && p.published === 1 && p.posttypevalue === 'Blog')
        .slice(0, 5);
}

async function getGallery() {
    const res = await fetch(`${config.service_url}getgallery`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.filter((g: any) => g.viewingallery === 1 || g.viewingallery === '1').slice(0, 9);
}

export const metadata = {
    title: 'Blog | Tsala Studio',
    description: 'Latest news and updates from Tsala Studio.',
};

export default async function BlogPage() {
    const postsData = getPosts();
    const recentData = getRecentPosts();
    const galleryData = getGallery();

    const [posts, recentPosts, gallery] = await Promise.all([postsData, recentData, galleryData]);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Banner */}
            <div className="bg-primary py-24 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/30 z-0" />
                <div className="relative z-10 container-custom">
                    <h1 className="text-5xl font-heading font-bold mb-4">Our Blog</h1>
                    <div className="flex justify-center gap-2 text-sm uppercase tracking-wider text-gray-300">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <span>/</span>
                        <span>Blog</span>
                    </div>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="w-full lg:w-2/3">
                        {posts.length > 0 ? (
                            posts.map((post: any) => (
                                <BlogCard key={post.id} post={post} />
                            ))
                        ) : (
                            <p className="text-center py-10 text-gray-500">No posts found.</p>
                        )}
                    </div>

                    {/* Sidebar */}
                    <BlogSidebar recentPosts={recentPosts} galleryImages={gallery} />
                </div>
            </div>
        </div>
    );
}
