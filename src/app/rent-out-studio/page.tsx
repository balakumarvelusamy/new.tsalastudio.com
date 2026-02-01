import React from 'react';
import Link from 'next/link';
import BookingForm from '../../components/studio/BookingForm';

export const metadata = {
    title: 'Rent Out Studio | Tsala Studio',
    description: 'Rent our studio space for your creative needs.',
};

export default function RentOutStudioPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
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
                    <h1 className="text-5xl font-heading font-bold mb-4">Rent Out Studio</h1>
                    <div className="flex justify-center gap-2 text-sm uppercase tracking-wider text-gray-300">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <span>/</span>
                        <span>Studio Rental</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="section-padding">
                <div className="container-custom max-w-4xl">
                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 text-center mb-12">
                        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">Create in Our Space</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Looking for a space to create? Our studio is equipped with longarm quilting machines, large cutting tables, and sewing stations. Book a slot to work on your projects in a professional environment.
                        </p>
                    </div>

                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
                        <h3 className="text-2xl font-bold font-heading mb-8 text-center text-gray-900">Book Your Slot</h3>
                        <BookingForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
