'use client';

import React, { useEffect, useState } from 'react';
import { isAuthenticated } from './adminAuth';
import AdminLogin from './AdminLogin';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsAuth(isAuthenticated());
        setIsLoading(false);
    }, []);

    const handleLogin = () => {
        setIsAuth(true);
    };

    if (isLoading) {
        // Prevent flash of unauthenticated content
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuth) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    return <>{children}</>;
}
