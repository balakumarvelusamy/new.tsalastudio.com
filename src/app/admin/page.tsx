import React from 'react';
import { getItemsByType } from '../../services/api';
import { BookOpenIcon, ShoppingBagIcon, DocumentTextIcon, PhotoIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function AdminDashboard() {
    const orders = await getItemsByType('order');
    const orderCount = Array.isArray(orders) ? orders.length : 0;

    const courses = await getItemsByType('course');
    const courseCount = Array.isArray(courses) ? courses.length : 0;

    const workshops = await getItemsByType('workshop');
    const workshopCount = Array.isArray(workshops) ? workshops.length : 0;

    const products = await getItemsByType('product');
    const productCount = Array.isArray(products) ? products.length : 0;

    const blogs = await getItemsByType('blog');
    const blogCount = Array.isArray(blogs) ? blogs.length : 0;

    const sliders = await getItemsByType('slider');
    const sliderCount = Array.isArray(sliders) ? sliders.length : 0;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 font-heading">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Courses Tile */}
                <Link href="/admin/course" className="block group">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Courses</h3>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                <BookOpenIcon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-gray-900">{courseCount}</span>
                            <span className="ml-2 text-sm text-gray-500">Live & Draft</span>
                        </div>
                    </div>
                </Link>

                {/* Workshops Tile */}
                <Link href="/admin/workshop" className="block group">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Workshops</h3>
                            <div className="p-2 bg-pink-50 text-pink-600 rounded-lg group-hover:bg-pink-100 transition-colors">
                                <AcademicCapIcon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-gray-900">{workshopCount}</span>
                            <span className="ml-2 text-sm text-gray-500">Sessions</span>
                        </div>
                    </div>
                </Link>

                {/* Products Tile */}
                <Link href="/admin/product" className="block group">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Products</h3>
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
                                <ShoppingBagIcon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-gray-900">{productCount}</span>
                            <span className="ml-2 text-sm text-gray-500">Inventory</span>
                        </div>
                    </div>
                </Link>

                {/* Blog Tile */}
                <Link href="/admin/blog" className="block group">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Blogs</h3>
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                                <DocumentTextIcon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-gray-900">{blogCount}</span>
                            <span className="ml-2 text-sm text-gray-500">Posts</span>
                        </div>
                    </div>
                </Link>

                {/* Orders Tile */}
                <Link href="/admin/order" className="block group">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Orders</h3>
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                <ShoppingBagIcon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-gray-900">{orderCount}</span>
                            <span className="ml-2 text-sm text-gray-500">Processed</span>
                        </div>
                    </div>
                </Link>

                {/* Slider Tile */}
                <Link href="/admin/slider" className="block group">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Slides</h3>
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100 transition-colors">
                                <PhotoIcon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-gray-900">{sliderCount}</span>
                            <span className="ml-2 text-sm text-gray-500">Images</span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
