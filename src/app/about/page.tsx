import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "About Us - Tsala Quilting Studio",
    description: "Learn about Tsala Quilting Studio, a creative space in Bengaluru for quilting and sewing enthusiasts.",
    keywords: ["About Tsala", "Quilting Studio Story", "Bengaluru Hobby Class"],
};

export default function About() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
            <p className="mt-4 text-gray-600">
                This is a placeholder for the About Us page content.
            </p>
        </div>
    );
}
