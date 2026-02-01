'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import config from '../../config.json';

export default function BookingForm() {
    const { register, handleSubmit, reset } = useForm();
    const [status, setStatus] = useState<string | null>(null);

    const onSubmit = async (data: any) => {
        setStatus('sending');
        // Construct detailed email body
        const body = `
            <h3>New Studio Booking Request</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Message:</strong><br/>${data.message}</p>
            <br/>
            <p>Please review and confirm this booking.</p>
        `;

        try {
            const res = await fetch(config.email_service_url || '', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    from: config.fromemail,
                    to: `${data.email},${config.fromemail}`, // Send to user + config email (CC effect)
                    subject: `Studio Booking Request - ${data.name}`,
                    text: "",
                    html: body
                })
            });

            if (res.ok) {
                setStatus('success');
                reset();
            } else {
                setStatus('error');
            }
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                        type="text"
                        required
                        placeholder="Name"
                        {...register('name')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-shadow"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                    <input
                        type="email"
                        required
                        placeholder="Email"
                        {...register('email')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-shadow"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        required
                        placeholder="Phone"
                        {...register('phone')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-shadow"
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                    <input
                        type="date"
                        required
                        {...register('date')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-shadow"
                    />
                </div>

                {/* Time */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time (Start - End)</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. 10:00 AM - 2:00 PM"
                        {...register('time')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-shadow"
                    />
                </div>
            </div>

            {/* Message */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message / Requirements</label>
                <textarea
                    rows={4}
                    placeholder="Tell us about your requirements..."
                    {...register('message')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-shadow"
                />
            </div>

            <button
                type="submit"
                disabled={status === 'sending'}
                className="btn btn-primary w-full py-4 text-lg"
            >
                {status === 'sending' ? 'Sending Request...' : 'Book Studio Now'}
            </button>

            {status === 'success' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center border border-green-200">
                    <p className="font-bold mb-1">Thank you for your request!</p>
                    <p>We will review and confirm your booking. Please check your spam email folder if you don't hear from us shortly.</p>
                </div>
            )}
            {status === 'error' && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center border border-red-200">
                    Something went wrong. Please try again or contact us directly.
                </div>
            )}
        </form>
    );
}
