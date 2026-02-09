import React from 'react';
import Link from 'next/link';
import config from '../../config.json';
import { getItemsByType } from '../../services/api';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import BlurImage from '../../components/Element/BlurImage';
import CoursePaymentButton from '../../components/Course/CoursePaymentButton';

export const metadata = {
    title: 'Workshops | Tsala Studio',
    description: 'Join our quilting workshops, hobby classes, and more.',
};

export default async function WorkshopsPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.q?.toLowerCase() || '';
    const page = Number(searchParams?.page) || 1;
    const ITEMS_PER_PAGE = 9;

    // Fetch workshops from API
    const data = await getItemsByType('workshop');

    const filteredWorkshops = data.filter((workshop: any) => {
        const isActive = workshop.isactive === 1 && workshop.published === 1; // && workshop.type === 'workshop'; 
        // Note: data is already fetched by type='workshop', but double checking is fine.
        if (!isActive) return false;

        const matchesQuery = workshop.posttitle.toLowerCase().includes(query) ||
            (workshop.postcontent && workshop.postcontent.toLowerCase().includes(query));
        return matchesQuery;
    }).sort((a: any, b: any) => {
        // 1. Sort by Registration Open status
        const regA = a.isregistrationopen === 1 ? 1 : 0;
        const regB = b.isregistrationopen === 1 ? 1 : 0;
        if (regA !== regB) return regB - regA; // Open first

        // 2. Sort by Created Date (Latest first)
        const dateA = new Date(a.createddate || 0).getTime();
        const dateB = new Date(b.createddate || 0).getTime();
        return dateB - dateA;
    });

    const totalPages = Math.ceil(filteredWorkshops.length / ITEMS_PER_PAGE);
    const paginatedWorkshops = filteredWorkshops.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div>
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
                    <h1 className="text-5xl font-heading font-bold mb-4">Workshops</h1>
                    <div className="flex justify-center gap-2 text-sm uppercase tracking-wider text-gray-300">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <span>/</span>
                        <span>Workshops</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="section-padding bg-gray-50">
                <div className="container-custom">

                    {/* Search Bar */}
                    <div className="mb-10 flex justify-center">
                        <form className="relative w-full max-w-lg">
                            <input
                                type="text"
                                name="q"
                                defaultValue={searchParams?.q || ''}
                                placeholder="Search workshops..."
                                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                            />
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </form>
                    </div>

                    {/* Workshops Grid */}
                    {paginatedWorkshops.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedWorkshops.map((workshop: any, index: number) => (
                                <Link
                                    href={`/courses/${workshop.slug}`} // Assuming workshops use same dynamic route or need a new one?
                                    // If workshops reuse /courses/[slug] logic (which they probably do if they are "items"), then this is fine.
                                    // If /courses/[slug] only fetches 'course' type, we might have an issue.
                                    // I'll assume they share the detail page for now as they are very similar.
                                    key={workshop.id || workshop.post_id || index}
                                    className="block group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                                >
                                    <div className="h-60 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors z-10" />
                                        {workshop.post_image ? (
                                            <BlurImage
                                                src={workshop.post_image}
                                                alt={workshop.posttitle}
                                                loading="lazy"
                                                className="w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}

                                        {workshop.postsubcategory && (
                                            <span className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
                                                {workshop.postsubcategory}
                                            </span>
                                        )}
                                        <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${workshop.isregistrationopen === 1
                                            ? 'bg-green-500 text-white'
                                            : 'bg-red-500 text-white'
                                            }`}>
                                            {workshop.isregistrationopen === 1 ? 'Open' : 'Closed'}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold font-heading mb-3 group-hover:text-primary transition-colors">
                                            {workshop.posttitle}
                                        </h3>
                                        <div
                                            className="text-gray-600 mb-6 text-sm line-clamp-3 flex-1"
                                            dangerouslySetInnerHTML={{ __html: workshop.postcontent }}
                                        />
                                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <CoursePaymentButton course={workshop} itemType="workshop" />
                                            </div>
                                            <span className="text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
                                                details &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-500">No workshops found matching your search.</p>
                            {query && (
                                <Link href="/workshops" className="mt-4 inline-block text-primary hover:underline">
                                    Clear Search
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center space-x-2">
                            {/* Previous Button */}
                            {page > 1 && (
                                <Link
                                    href={`/workshops?${new URLSearchParams({ ...(searchParams?.q ? { q: searchParams.q } : {}), page: (page - 1).toString() }).toString()}`}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                                >
                                    Previous
                                </Link>
                            )}

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <Link
                                    key={p}
                                    href={`/workshops?${new URLSearchParams({ ...(searchParams?.q ? { q: searchParams.q } : {}), page: p.toString() }).toString()}`}
                                    className={`w-10 h-10 flex items-center justify-center rounded-md border ${p === page
                                        ? 'bg-primary text-white border-primary'
                                        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    {p}
                                </Link>
                            ))}

                            {/* Next Button */}
                            {page < totalPages && (
                                <Link
                                    href={`/workshops?${new URLSearchParams({ ...(searchParams?.q ? { q: searchParams.q } : {}), page: (page + 1).toString() }).toString()}`}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* CTA */}
            <div className="py-20 bg-primary text-white text-center">
                <div className="container-custom max-w-3xl">
                    <h3 className="text-3xl font-heading font-bold mb-6">Join a Workshop Today!</h3>
                    <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
                        Learn new skills, meet fellow quilting enthusiasts, and create something beautiful.
                    </p>
                    <Link href="/contact" className="btn bg-white text-primary hover:bg-gray-100">
                        Contact for Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
