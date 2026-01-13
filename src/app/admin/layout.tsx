import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminGuard from './AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
                <AdminSidebar />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto h-screen">
                    <div className="p-4 md:p-8 pb-20">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
