import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Shop - Tsala Quilting Studio",
    description: "Buy quilting fabrics, supplies, and handmade gifts from our online store.",
    keywords: ["Buy Quilting Fabric", "Sewing Supplies", "Online Craft Store", "Bengaluru"],
};

export default function Shop() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
            <p className="mt-4 text-gray-600">
                This is a placeholder for the Shop page content.
            </p>
        </div>
    );
}
