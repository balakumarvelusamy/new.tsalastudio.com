import React from 'react';
import { getItemsByType } from '../../services/api';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function AdminDashboard() {
    const courses = await getItemsByType('course');
    const courseCount = Array.isArray(courses) ? courses.length : 0;

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
            </div>
        </div>
    );
}
