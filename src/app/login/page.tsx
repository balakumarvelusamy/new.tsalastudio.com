import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata = {
    title: 'Login | Tsala Studio',
    description: 'Login to your Tsala Studio account.',
};

export default function LoginPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-20 flex flex-col justify-center">
            <div className="container-custom">
                {/* Breadcrumbs */}
                <div className="mb-8 text-center">
                    <div className="flex justify-center gap-2 text-sm uppercase tracking-wider text-gray-500 mb-4">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <span>/</span>
                        <span>Login</span>
                    </div>
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
