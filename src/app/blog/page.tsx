import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Blog - Tsala Quilting Studio",
    description: "Read our latest tips, tutorials, and stories about quilting, sewing, and handmade crafts.",
    keywords: ["Quilting Blog", "Sewing Tips", "Craft Tutorials", "DIY Projects"],
};

export default function Blog() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
            <p className="mt-4 text-gray-600">
                This is a placeholder for the Blog page content.
            </p>
        </div>
    );
}
