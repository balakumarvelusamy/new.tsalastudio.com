
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
// import coursesData from '../../../data/courses.json'; // Removed
import { getItemsByType } from '../../../services/api';
import { Metadata } from 'next';
import config from '../../../config.json';
import BlurImage from '../../../components/Element/BlurImage';

type Props = {
    params: Promise<{ slug: string }>;
};

// Helper to get post by slug
async function getPost(slug: string) {
    const blogs = await getItemsByType('blog');
    return Array.isArray(blogs) ? blogs.find((c: any) => c.slug === slug) : null;
}

// Dynamic SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = (await params).slug;
    const post = await getPost(slug);

    if (!post) {
        return {
            title: 'Article Not Found',
        };
    }

    // Strip HTML for description
    const strippedDesc = post.postcontent
        ? post.postcontent.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...'
        : 'Read this article at Tsala Studio';

    return {
        title: `${post.posttitle} | Tsala Studio`,
        description: strippedDesc,
        openGraph: {
            title: post.posttitle,
            description: strippedDesc,
            images: post.post_image ? [post.post_image] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.posttitle,
            description: strippedDesc,
            images: post.post_image ? [post.post_image] : [],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const slug = (await params).slug;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    // Since we are using ID-Slug, the URL slug parameter is the combined string.
    // If we want to link back or share, we should use this combined slug.
    const currentUrlSlug = slug;

    return (
        <div>
            {/* Banner */}
            <div className="relative py-20 text-center text-white overflow-hidden bg-gray-900">
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
                    <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">{post.posttitle}</h1>
                    <div className="flex justify-center gap-2 text-sm uppercase tracking-wider text-gray-300">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                        <span>/</span>
                        <span className="truncate max-w-[200px]">{post.posttitle}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="section-padding bg-white">
                <div className="container-custom max-w-4xl">
                    <div className="flex flex-col gap-8">

                        {/* Featured Image */}
                        {post.post_image && (
                            <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-100 aspect-video relative">
                                <BlurImage
                                    src={post.post_image}
                                    alt={post.posttitle}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-100 pb-6">
                            <span>📅 {post.displaydate}</span>
                            <span>👤 {post.createdby || 'Admin'}</span>
                            {post.postcategory && (
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase text-xs">
                                    {post.postcategory}
                                </span>
                            )}
                        </div>

                        {/* Article Content */}
                        <article className="prose prose-lg prose-indigo max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: post.postcontent }} />
                        </article>

                        {/* Share / Navigation */}
                        <div className="border-t border-gray-100 pt-8 mt-8 flex justify-between items-center">
                            <Link href="/blog" className="text-primary font-bold hover:underline">
                                ← Back to Blog
                            </Link>

                            {/* Simple Share Buttons */}
                            <div className="flex gap-4">
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${config.domain}/blog/${currentUrlSlug}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-[#1877F2] transition-colors"
                                    title="Share on Facebook"
                                >
                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.posttitle)}&url=${encodeURIComponent(`${config.domain}/blog/${currentUrlSlug}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-[#1DA1F2] transition-colors"
                                    title="Share on Twitter"
                                >
                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
