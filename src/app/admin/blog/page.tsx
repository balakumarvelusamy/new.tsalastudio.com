import React from 'react';
import Link from 'next/link';
import { getItemsByType } from '../../../services/api';
import BlogListClient from './BlogListClient';

export default async function AdminBlogPage() {
    // Fetch blogs from API
    const blogs = await getItemsByType('blog');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold font-heading">Manage Blogs</h1>
                {/* Action button moved to Client Component */}
            </div>

            <BlogListClient initialBlogs={blogs} />
        </div>
    );
}
