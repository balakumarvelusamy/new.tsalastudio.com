'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import config from '../../config.json';

export default function ContactForm() {
    const { register, handleSubmit, reset } = useForm();
    const [status, setStatus] = useState<string | null>(null);

    const onSubmit = async (data: any) => {
        setStatus('sending');
        const body = `<p>Hello ${data.c_name},</p><p>Thanks for reaching us, we will get back to you shortly.</p><br/><p>Regards,</p><p><a href='https://www.tsalastudio.com'>Tsala Studio Team</a></p><table style='border: 1px solid black'><tr style='border: 1px solid black'><td><i>Name:</i></td><td><i>${data.c_name}</i></td></tr><tr style='border: 1px solid black'><td><i>Email:</i></td><td><i>${data.c_email}</i></td></tr><tr style='border: 1px solid black'><td><i>Message:</i></td><td><i>${data.c_message}</i></td></tr></table>`;

        try {
            const res = await fetch(config.email_service_url || '', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    from: config.fromemail,
                    to: `${data.c_email},${config.fromemail}`,
                    subject: `${config.subject} ${data.c_name}`,
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
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                    type="text"
                    required
                    placeholder="Name"
                    {...register('c_name')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-shadow"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input
                    type="email"
                    required
                    placeholder="Email"
                    {...register('c_email')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-shadow"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                    rows={4}
                    required
                    placeholder="How can we help you?"
                    {...register('c_message')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-shadow"
                />
            </div>

            <button
                type="submit"
                disabled={status === 'sending'}
                className="btn btn-primary w-full py-4 text-lg"
            >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center">
                    Message sent successfully! We will get back to you soon.
                </div>
            )}
            {status === 'error' && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center">
                    Something went wrong. Please try again.
                </div>
            )}
        </form>
    );
}
