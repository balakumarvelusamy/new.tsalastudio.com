import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Workshops | Tsala Studio',
    description: 'Join our creative workshops.',
};

export default function WorkshopsPage() {
    return (
        <div className="pt-32 pb-20 container-custom text-center">
            <h1 className="text-4xl font-heading mb-6">Workshops</h1>
            <p className="text-lg text-gray-600 mb-8">Currently under construction. Check back soon for our upcoming workshops!</p>
            <Link href="/courses" className="btn btn-primary">
                View Our Courses
            </Link>
        </div>
    );
}
