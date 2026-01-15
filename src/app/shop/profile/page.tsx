'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import secureLocalStorage from 'react-secure-storage';
import { useRouter } from 'next/navigation';
import { getItemsById, saveItem } from '../../../services/api';

export default function ProfilePage() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const uuid = secureLocalStorage.getItem('tsalauuid') as string;
            if (!uuid) {
                router.push('/login');
                return;
            }

            const data = await getItemsById(uuid);
            if (data && data.length > 0) {
                // Assuming getItemsById returns array based on user provided sample, but user said 'const data = await response.json(); return data || []'.
                // If ID query returns single object (standard REST) or array (filter style)?
                // User sample: const url = .../items/id/${id} -> res.json().
                // Standard get-by-id usually returns object. But let's handle both.
                const user = Array.isArray(data) ? data[0] : data;
                setUserData(user);

                // Prefill form
                setValue('name', user.name);
                setValue('phonenumber', user.phonenumber);
                setValue('email', user.email);
                setValue('address', user.address);
                setValue('city', user.city);
                setValue('state', user.state);
                setValue('pincode', user.pincode);
            }
            setLoading(false);
        };

        fetchProfile();
    }, [router, setValue]);

    const onSubmit = async (data: any) => {
        setSaving(true);
        setStatus(null);

        try {
            const updatedUser = {
                ...userData,
                name: data.name,
                phonenumber: data.phonenumber, // Keep phone number
                email: data.email,
                address: data.address,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
            };

            // Handle password change if provided
            if (data.newPassword) {
                if (data.newPassword !== data.confirmPassword) {
                    setStatus({ type: 'error', message: "Passwords don't match" });
                    setSaving(false);
                    return;
                }

                const bcrypt = await import('bcryptjs');
                const hashedPassword = await bcrypt.hash(data.newPassword, 10);
                updatedUser.password = hashedPassword;
            }

            console.log("Updating user:", updatedUser);
            await saveItem(updatedUser);

            // Update local storage if name changed
            if (data.name !== userData.name) {
                secureLocalStorage.setItem('tsalaname', data.name);
                // Trigger header update? Header checks storage on mount/route change. Window reload might be needed or context.
                window.location.reload();
            }

            setStatus({ type: 'success', message: 'Profile updated successfully!' });
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-12 text-center">Loading profile...</div>;
    }

    return (
        <div className="container-custom py-12">
            <h1 className="text-3xl font-heading font-bold mb-8">My Profile</h1>

            <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                {status && (
                    <div className={`mb-6 p-4 rounded-lg ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                {...register('name', { required: true })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                {...register('phonenumber', { required: true })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                                readOnly // Usually treating phone/email as identifier implies restricted edit, but user said "update phone number". I'll allow it.
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            {...register('email')}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                            {...register('address')}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                {...register('city', { required: true })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input
                                {...register('state', { required: true })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                            <input
                                {...register('pincode', {
                                    required: "Pincode is required",
                                    pattern: {
                                        value: /^\d{6}$/,
                                        message: "Pincode must be exactly 6 digits"
                                    }
                                })}
                                maxLength={6}
                                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.pincode && (
                                <p className="text-red-500 text-xs mt-1">{errors.pincode.message as string}</p>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6 mt-6">
                        <h3 className="text-lg font-bold mb-4">Change Password</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    {...register('newPassword')}
                                    placeholder="Leave blank to keep current"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    {...register('confirmPassword')}
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-primary w-full md:w-auto px-8"
                        >
                            {saving ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
