import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Our Courses & Services - Tsala Quilting Studio",
    description: "Explore our range of hobby classes including Quilting, Sewing, Bag Making, Knitting, Crochet, and Longarm services.",
    keywords: ["Sewing Classes", "Quilting Workshops", "Longarm Quilting", "Bag Making Course", "Bengaluru"],
};

export default function OurServices() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900">Our Courses</h1>
            <p className="mt-4 text-gray-600">
                This is a placeholder for the Courses/Services page content.
            </p>
        </div>
    );
}
