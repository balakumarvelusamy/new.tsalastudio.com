'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import config from '../../config.json';

const Newsletter = () => {
    const [status, setStatus] = useState<string | null>(null);
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data: any) => {
        setStatus('sending');
        try {
            const payload = {
                data: {
                    email: data.email,
                    createddate: new Date(),
                }
            };

            const res = await fetch(`${config.service_url}newsletter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (result.status === 200) {
                setStatus('success');
                reset();
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="section-padding bg-gray-900 text-white">
            <div className="container-custom text-center">
                <h2 className="text-3xl font-heading font-bold mb-4">Subscribe to our Newsletter</h2>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">Get the latest updates on workshops, new arrivals in the shop, and exclusive offers.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto flex gap-2">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        {...register('email', { required: true })}
                        className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                    <button type="submit" disabled={status === 'sending'} className="btn btn-secondary">
                        {status === 'sending' ? 'Joining...' : 'Join Us'}
                    </button>
                </form>
                {status === 'success' && <p className="text-green-400 mt-4">Thank you for subscribing!</p>}
                {status === 'error' && <p className="text-red-400 mt-4">Something went wrong. Please try again.</p>}
            </div>
        </div>
    );
};

export default Newsletter;
