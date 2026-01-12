import React from 'react';
import { BlogSidebar } from '@/components/blog/BlogComponents';
import config from '../../../config.json';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getPost(slug: string) {
    const res = await fetch(`${config.service_url}getpostbyslug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    // API might return array or object, based on source it looks like object or array? 
    // Source usage: props.match.params.slug
    // Let's assume it returns object or list
    if (Array.isArray(data)) return data[0];
    return data;
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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // id is actually slug here
    const post = await getPost(id);
    return {
        title: post ? `${post.posttitle} | Tsala Studio` : 'Post Not Found',
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getPost(id);
    const recentData = getRecentPosts();
    const galleryData = getGallery();

    const [recentPosts, gallery] = await Promise.all([recentData, galleryData]);

    if (!post) {
        return notFound();
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Banner */}
            <div className="bg-primary py-24 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/30 z-0" />
                <div className="relative z-10 container-custom">
                    <h1 className="text-4xl font-heading font-bold mb-4 max-w-4xl mx-auto">{post.posttitle}</h1>
                    <div className="flex justify-center gap-2 text-sm uppercase tracking-wider text-gray-300">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-white">Blog</Link>
                        <span>/</span>
                        <span>Detail</span>
                    </div>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="w-full lg:w-2/3 bg-white p-8 rounded-xl shadow-sm h-fit">
                        <img src={post.post_image} alt={post.posttitle} className="w-full h-96 object-cover rounded-lg mb-8" />

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-b pb-6">
                            <span className="font-semibold text-primary">{post.createdby}</span>
                            <span>•</span>
                            <span>{post.displaydate}</span>
                        </div>

                        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: post.postcontent }} />
                    </div>

                    {/* Sidebar */}
                    <BlogSidebar recentPosts={recentPosts} galleryImages={gallery} />
                </div>
            </div>
        </div>
    );
}
