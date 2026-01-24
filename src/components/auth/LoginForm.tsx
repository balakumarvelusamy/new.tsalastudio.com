'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import config from '../../config.json';
import { useRouter } from 'next/navigation';
import { filterItems } from '../../services/api';
import secureLocalStorage from 'react-secure-storage';
import Link from 'next/link';

export default function LoginForm() {
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError('');

        try {
            // Fetch user by phone number using generic filter
            const users = await filterItems('phonenumber', data.phonenumber, 'type', 'user');

            if (!Array.isArray(users) || users.length === 0) {
                setError('Phone number is incorrect');
                setLoading(false);
                return;
            }

            const user = users[0];

            if (!user || !user.password) {
                // User found, but data is corrupted or password missing?
                // Treat as invalid credentials to be safe
                console.error("User found but invalid user object structure or missing password", user);
                setError('Invalid account data');
                setLoading(false);
                return;
            }

            // Import bcryptjs dynamically
            const bcrypt = await import('bcryptjs');

            // Compare password
            const isMatch = await bcrypt.compare(data.password, user.password);

            if (isMatch) {
                // Success
                secureLocalStorage.setItem('tsalauuid', user.userid || user.id);
                secureLocalStorage.setItem('tsalaname', user.name);
                secureLocalStorage.setItem('tsalarole', user.role);
                secureLocalStorage.setItem('tsalatoken', 'client-session');

                window.location.href = '/shop';
            } else {
                setError('Password is incorrect');
            }
        } catch (e) {
            setError('Something went wrong. Please try again.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold font-heading">Login</h2>
                <p className="text-gray-500 text-sm">Welcome back! Please login to your account.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        required
                        placeholder="Enter phone number"
                        {...register('phonenumber', {
                            onChange: (e) => {
                                e.target.value = e.target.value.replace(/\D/g, '');
                                if (e.target.value.length > 10) e.target.value = e.target.value.slice(0, 10);
                            }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        placeholder="********"
                        {...register('password')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                    />
                </div>

                {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full py-3"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <p className="text-gray-500">Don't have an account? <Link href="/register" className="text-primary font-semibold hover:underline">Register</Link></p>
            </div>
        </div>
    );
}
