'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { filterItems, saveItem } from '../../services/api';

export default function RegisterPage() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const router = useRouter();

    const onSubmit = async (data: any) => {
        setLoading(true);
        setStatus(null);

        // 1. Validate Confirm Password (handled by UI but good to double check)
        if (data.password !== data.confirmPassword) {
            setStatus({ type: 'error', message: "Passwords do not match." });
            setLoading(false);
            return;
        }

        try {
            // 2. Check for duplicate phone number AND email
            const [existingPhone, existingEmail] = await Promise.all([
                filterItems('phonenumber', data.phonenumber, 'type', 'user'),
                filterItems('email', data.email, 'type', 'user')
            ]);

            if (existingPhone && Array.isArray(existingPhone) && existingPhone.length > 0) {
                setStatus({ type: 'error', message: "Phone Number already exists!!" });
                setLoading(false);
                return;
            }

            if (existingEmail && Array.isArray(existingEmail) && existingEmail.length > 0) {
                setStatus({ type: 'error', message: "Email Account already exists!!" });
                setLoading(false);
                return;
            }

            // 3. Hash Password
            const bcrypt = await import('bcryptjs');
            const hashedPassword = await bcrypt.hash(data.password, 10);

            // 4. Generate ID & Construct User Object
            const userId = crypto.randomUUID();

            const newUser = {
                id: userId,
                userid: userId, // Keeping both for compatibility as per sample
                type: 'user',
                name: `${data.firstname} ${data.lastname}`.trim(), // Composing name as per user logic
                email: data.email,
                phonenumber: data.phonenumber,
                password: hashedPassword,
                address: data.address || '',
                city: data.city || '',
                state: data.state || '',
                pincode: data.pincode || '',
                isactive: 1,
                createddate: new Date().toISOString(),
                loggedin: false
            };

            console.log("Registering user:", newUser);

            // 5. Save User
            await saveItem(newUser);

            setStatus({ type: 'success', message: 'User Registered Successfully!' });

            // Redirect after delay
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (error: any) {
            console.error("Registration failed:", error);
            setStatus({ type: 'error', message: error.message || 'Something went wrong, please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-custom py-12 flex justify-center">
            <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-heading font-bold mb-6 text-center">Create Account</h1>

                {status && (
                    <div className={`mb-6 p-4 rounded-lg text-center ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                            <input
                                {...register('firstname', { required: "First Name is required" })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                                placeholder="First Name"
                            />
                            {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname.message as string}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                {...register('lastname')}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                                placeholder="Last Name"
                            />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            {...register('email', {
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                            })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            {...register('phonenumber', { required: "Phone Number is required" })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                            placeholder="e.g. 9876543210"
                        />
                        {errors.phonenumber && <p className="text-red-500 text-xs mt-1">{errors.phonenumber.message as string}</p>}
                    </div>

                    {/* Address Fields (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                            {...register('address')}
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                            placeholder="Street address (Optional)"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                {...register('city')}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                                placeholder="City"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input
                                {...register('state')}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                                placeholder="State"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                            <input
                                {...register('pincode')}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                                placeholder="Pincode"
                            />
                        </div>
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                            <input
                                type="password"
                                {...register('password', { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                                placeholder="******"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                            <input
                                type="password"
                                {...register('confirmPassword', {
                                    required: "Please confirm password",
                                    validate: (val: string) => {
                                        if (watch('password') != val) {
                                            return "Passwords do not match";
                                        }
                                    }
                                })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                                placeholder="******"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn btn-primary py-4 text-lg shadow-lg hover:shadow-xl transition-all mt-4"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-gray-500 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary font-semibold hover:underline">
                                Log In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
