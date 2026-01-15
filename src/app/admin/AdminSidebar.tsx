'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, HomeIcon, BookOpenIcon, DocumentTextIcon, ArrowPathIcon, ShoppingBagIcon, PhotoIcon } from '@heroicons/react/24/outline'; // Add icons as needed

export default function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        { name: 'Slider', href: '/admin/slider', icon: PhotoIcon },
        { name: 'Courses', href: '/admin/course', icon: BookOpenIcon },
        { name: 'Products', href: '/admin/product', icon: ShoppingBagIcon },
        { name: 'Migration', href: '/admin/migrate', icon: ArrowPathIcon },
        { name: 'Blog', href: '/admin/blog', icon: DocumentTextIcon },
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Header / Toggle */}
            <div className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-20">
                <span className="font-bold text-lg text-primary font-heading">Tsala Admin</span>
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none"
                >
                    {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                </button>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
                    fixed md:static inset-y-0 left-0 z-20
                    w-64 bg-white shadow-xl md:shadow-md transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 flex-shrink-0 h-full flex flex-col
                `}
            >
                <div className="p-6 border-b border-gray-100 hidden md:block">
                    <h1 className="text-xl font-bold text-primary font-heading">Tsala Admin</h1>
                </div>

                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)} // Close on mobile click
                                className={`
                                    flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
                                    ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary'}
                                `}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                    <div className="px-4 py-3 text-gray-400 text-sm italic">
                        More modules coming soon...
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link href="/" className="flex items-center px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        &larr; Back to Website
                    </Link>
                </div>
            </aside>
        </>
    );
}
