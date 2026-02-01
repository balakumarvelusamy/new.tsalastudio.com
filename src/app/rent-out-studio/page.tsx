import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Rent Out Studio | Tsala Studio',
    description: 'Rent our studio space for your creative needs.',
};

export default function RentOutStudioPage() {
    return (
        <div className="pt-32 pb-20 container-custom text-center">
            <h1 className="text-4xl font-heading mb-6">Rent Out Studio</h1>
            <p className="text-lg text-gray-600 mb-8">Looking for a space to create? Our studio rental details are coming soon.</p>
            <Link href="/contact" className="btn btn-primary">
                Contact Us for Inquiries
            </Link>
        </div>
    );
}
