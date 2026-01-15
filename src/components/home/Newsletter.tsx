'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { saveItem, checkSubscription } from '../../services/api';

const Newsletter = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [message, setMessage] = useState<string>('');
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data: any) => {
        setStatus('sending');
        setMessage('');
        const lowerEmail = data.email.toLowerCase().trim();
        try {
            // Check for existing subscription
            const existing = await checkSubscription(lowerEmail);
            if (existing && existing.length > 0) {
                setStatus('error');
                setMessage('This email is already subscribed.');
                return;
            }

            const newItem = {
                createddate: new Date().toISOString(),
                email: lowerEmail,
                id: crypto.randomUUID(),
                type: 'newsletter',
                isactive: 1
            };

            await saveItem(newItem);

            setStatus('success');
            setMessage('Thank you for subscribing!');
            reset();
        } catch (error) {
            console.error("Newsletter error:", error);
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
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
                        className="flex-grow px-4 py-3 rounded-lg text-white bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent placeholder-gray-400"
                    />
                    <button type="submit" disabled={status === 'sending'} className="btn btn-secondary">
                        {status === 'sending' ? 'Joining...' : 'Join Us'}
                    </button>
                </form>
                {message && (
                    <p className={`mt-4 ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Newsletter;
