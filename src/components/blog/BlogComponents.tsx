'use client';
import Link from 'next/link';
import React from 'react';

export const BlogCard = ({ post }: { post: any }) => {
    return (
        <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow mb-8 border border-gray-100">
            <div className="md:w-1/3 flex-shrink-0">
                <Link href={`/blog/${post.slug}`} className="block h-64 md:h-full rounded-lg overflow-hidden group">
                    <img
                        src={post.post_image}
                        alt={post.posttitle}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                </Link>
            </div>
            <div className="md:w-2/3 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {post.displaydate}
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        {post.createdby}
                    </span>
                </div>
                <h2 className="text-2xl font-bold font-heading mb-4">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.posttitle}
                    </Link>
                </h2>
                <div className="text-gray-600 line-clamp-3 mb-6" dangerouslySetInnerHTML={{ __html: post.postcontent?.substring(0, 200) + '...' }} />
                <div>
                    <Link href={`/blog/${post.slug}`} className="btn btn-outline-primary btn-sm">
                        Read More
                    </Link>
                </div>
            </div>
        </div>
    );
};

export const BlogSidebar = ({ recentPosts, galleryImages }: { recentPosts: any[], galleryImages: any[] }) => {
    return (
        <aside className="w-full lg:w-1/3 space-y-8">
            {/* Recent Posts */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-heading font-bold mb-6 border-b pb-2">Recent Posts</h3>
                <div className="space-y-6">
                    {recentPosts.map((post: any, i) => (
                        <div key={i} className="flex gap-4 group">
                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                <img src={post.post_image} alt={post.posttitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                                <span className="text-xs text-secondary font-medium block mb-1">{post.displaydate}</span>
                                <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">
                                    <Link href={`/blog/${post.slug}`}>{post.posttitle}</Link>
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gallery */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-heading font-bold mb-6 border-b pb-2">Small Gallery</h3>
                <div className="grid grid-cols-3 gap-2">
                    {galleryImages.map((img: any, i) => (
                        <a key={i} href={img.imageurl} target="_blank" rel="noopener noreferrer" className="block w-full h-24 rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                            <img src={img.imageurl} alt={img.title || 'Gallery'} className="w-full h-full object-cover" />
                        </a>
                    ))}
                </div>
            </div>
        </aside>
    );
};
