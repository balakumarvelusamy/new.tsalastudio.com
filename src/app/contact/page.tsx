import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Contact Us - Tsala Quilting Studio",
    description: "Visit us in Bengaluru or contact us for inquiries about our classes and services. Call 9880162266.",
    keywords: ["Contact Tsala Studio", "Tsala Studio Location", "Bengaluru Quilting Studio Address"],
};

export default function Contact() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
            <p className="mt-4 text-gray-600">
                This is a placeholder for the Contact Us page content.
            </p>
        </div>
    );
}
