import React from 'react';
import ContactForm from '@/components/contact/ContactForm';
import config from '../../config.json';
import Link from 'next/link';

export const metadata = {
    title: 'Contact Us | Tsala Studio',
    description: 'Get in touch with Tsala Studio.',
};

export default function ContactPage() {
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Banner */}
            <div className="relative py-24 text-center text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/banner.jpg"
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 container-custom">
                    <h1 className="text-5xl font-heading font-bold mb-4">Contact Us</h1>
                    <div className="flex justify-center gap-2 text-sm uppercase tracking-wider text-gray-300">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <span>/</span>
                        <span>Contact</span>
                    </div>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Info */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-fit">
                        <h3 className="text-2xl font-bold font-heading mb-6 text-gray-900">Quick Contact</h3>
                        <p className="text-gray-600 mb-8">
                            Better yet, see us in person! We love our customers, so feel free to visit during normal business hours.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <div>
                                    <h6 className="font-bold text-gray-900 uppercase text-sm mb-1">Address</h6>
                                    <p className="text-gray-600">{config.contact_address}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <h6 className="font-bold text-gray-900 uppercase text-sm mb-1">Email</h6>
                                    <p className="text-gray-600">{config.contact_email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <div>
                                    <h6 className="font-bold text-gray-900 uppercase text-sm mb-1">Phone</h6>
                                    <p className="text-gray-600">{config.contact_phone1}</p>
                                    <p className="text-gray-600">{config.contact_phone2}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-2xl font-bold font-heading mb-6 text-gray-900">Send Message</h3>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
