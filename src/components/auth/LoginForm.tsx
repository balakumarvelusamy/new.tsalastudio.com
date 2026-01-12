'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import config from '../../config.json';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${config.service_url}login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phonenumber: data.phonenumber,
                    password: data.password
                })
            });

            const result = await res.json();

            if (result.status === 200) {
                localStorage.setItem('uuid', result.data.uuid);
                localStorage.setItem('name', result.data.name);
                localStorage.setItem('role', result.data.role);
                localStorage.setItem('accessToken', result.data.token);
                // router.push('/shop'); // Redirect to shop
                window.location.href = '/shop'; // Force full nav ensures Header updates state if any
            } else {
                setError(result.message || 'Login failed');
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
                        type="text"
                        required
                        placeholder="Enter phone number"
                        {...register('phonenumber')}
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
                <p className="text-gray-500">Don't have an account? <span className="text-gray-400 cursor-not-allowed">Register (Coming Soon)</span></p>
            </div>
        </div>
    );
}
