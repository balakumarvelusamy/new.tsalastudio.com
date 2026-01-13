'use client';

import React, { useState } from 'react';
import { login } from './adminAuth';

interface AdminLoginProps {
    onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (login(password)) {
            onLogin();
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                    <p className="text-gray-500 mt-2">Please enter the password to verify access.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none"
                            placeholder="Enter password"
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
                    >
                        Login
                    </button>

                    <p className="text-xs text-center text-gray-400 mt-4">
                        Session valid for 24 hours.
                    </p>
                </form>
            </div>
        </div>
    );
}
