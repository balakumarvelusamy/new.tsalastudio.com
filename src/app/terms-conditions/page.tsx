
import React from 'react';
import Link from 'next/link';
import config from '../../config.json';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions | Tsala Studio',
    description: 'Read our Return & Refund Policy, Shipping Policy, and Privacy Policy.',
};

export default function TermsConditionsPage() {
    return (
        <div>
            {/* Banner */}
            <div className="relative py-24 text-center text-white overflow-hidden bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        src="/images/banner.jpg"
                        alt="Banner"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />

                <div className="relative z-10 container-custom">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Terms & Conditions</h1>
                    <div className="flex justify-center gap-2 text-sm uppercase tracking-wider text-gray-300">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <span>Terms & Conditions</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="section-padding bg-white">
                <div className="container-custom max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-12">

                        {/* Return & Refund Policy */}
                        <div className="prose prose-lg prose-indigo max-w-none">
                            <div
                                className="text-gray-600 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: config.tc1 }}
                            />
                        </div>

                        {/* Divider */}
                        <hr className="border-gray-100" />

                        {/* Shipping Policy */}
                        <div className="prose prose-lg prose-indigo max-w-none">
                            <div
                                className="text-gray-600 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: config.tc2 }}
                            />
                        </div>

                        {/* Divider */}
                        <hr className="border-gray-100" />

                        {/* Privacy Policy */}
                        <div className="prose prose-lg prose-indigo max-w-none">
                            <div
                                className="text-gray-600 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: config.tc3 }}
                            />
                            <div
                                className="text-gray-600 leading-relaxed mt-4"
                                dangerouslySetInnerHTML={{ __html: config.tc4 }}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
