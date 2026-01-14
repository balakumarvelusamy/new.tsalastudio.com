import React from 'react';
import Link from 'next/link';
// import coursesData from '../../data/courses.json'; // Removed
import config from '../../config.json';
import { getItemsByType } from '../../services/api';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import BlurImage from '../../components/Element/BlurImage';

export const metadata = {
    title: 'Our Courses | Tsala Studio',
    description: 'Join our quilting workshops, hobby classes, and more.',
};

export default async function CoursesPage(props: { searchParams: Promise<{ q?: string; page?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.q?.toLowerCase() || '';
    const page = Number(searchParams?.page) || 1;
    const ITEMS_PER_PAGE = 9;

    // Fetch courses from API
    const data = await getItemsByType('course');
    // Filter courses
    // Note: Filtering by title and content.
    // Also ensuring we only show active/published ones as per original logic.
    const filteredCourses = data.filter((course: any) => {
        const isActive = course.isactive === 1 && course.published === 1 && course.type === 'course';
        if (!isActive) return false;

        const matchesQuery = course.posttitle.toLowerCase().includes(query) ||
            (course.postcontent && course.postcontent.toLowerCase().includes(query));
        return matchesQuery;
    }).sort((a: any, b: any) => {
        // 1. Sort by Registration Open status (1 comes before 0/undefined)
        const regA = a.isregistrationopen === 1 ? 1 : 0;
        const regB = b.isregistrationopen === 1 ? 1 : 0;
        if (regA !== regB) return regB - regA; // Open first

        // 2. Sort by Created Date (Latest first)
        const dateA = new Date(a.createddate || 0).getTime();
        const dateB = new Date(b.createddate || 0).getTime();
        return dateB - dateA;
    });

    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    const paginatedCourses = filteredCourses.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
                    <h1 className="text-5xl font-heading font-bold mb-4">Our Courses</h1>
                    <div className="flex justify-center gap-2 text-sm uppercase tracking-wider text-gray-300">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <span>/</span>
                        <span>Courses</span>
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
                                placeholder="Search courses..."
                                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                            />
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </form>
                    </div>

                    {/* Courses Grid */}
                    {paginatedCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedCourses.map((course: any) => (
                                <Link
                                    href={`/courses/${course.slug}`}
                                    key={course.post_id}
                                    className="block group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                                >
                                    <div className="h-60 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors z-10" />
                                        {course.post_image ? (
                                            <BlurImage
                                                src={course.post_image}
                                                alt={course.posttitle}
                                                loading="lazy"
                                                className="w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}

                                        {course.postsubcategory && (
                                            <span className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
                                                {course.postsubcategory}
                                            </span>
                                        )}
                                        <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${course.isregistrationopen === 1
                                            ? 'bg-green-500 text-white'
                                            : 'bg-red-500 text-white'
                                            }`}>
                                            {course.isregistrationopen === 1 ? 'Open for Registration' : 'Closed'}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold font-heading mb-3 group-hover:text-primary transition-colors">
                                            {course.posttitle}
                                        </h3>
                                        <div
                                            className="text-gray-600 mb-6 text-sm line-clamp-3 flex-1"
                                            dangerouslySetInnerHTML={{ __html: course.postcontent }}
                                        />
                                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                            <span className="text-sm text-gray-400">{course.displaydate}</span>
                                            <span className="text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
                                                View Details &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-500">No courses found matching your search.</p>
                            {query && (
                                <Link href="/courses" className="mt-4 inline-block text-primary hover:underline">
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
                                    href={`/courses?${new URLSearchParams({ ...(searchParams?.q ? { q: searchParams.q } : {}), page: (page - 1).toString() }).toString()}`}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                                >
                                    Previous
                                </Link>
                            )}

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <Link
                                    key={p}
                                    href={`/courses?${new URLSearchParams({ ...(searchParams?.q ? { q: searchParams.q } : {}), page: p.toString() }).toString()}`}
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
                                    href={`/courses?${new URLSearchParams({ ...(searchParams?.q ? { q: searchParams.q } : {}), page: (page + 1).toString() }).toString()}`}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* About Quilting Section */}
            <div className="bg-gray-900 text-white py-20">
                <div className="container-custom">
                    <h2 className="text-3xl font-heading font-bold text-center mb-16">About Quilting?</h2>
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="md:w-1/3">
                            <img src={config.aboutus_imageurl1} className="rounded-xl shadow-2xl w-full h-80 object-cover" alt="Quilting" />
                        </div>
                        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                config.about_ABOUTQUILTING1,
                                config.about_ABOUTQUILTING2,
                                config.about_ABOUTQUILTING3
                            ].map((text, i) => (
                                <div key={i} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                                    <h4 className="font-bold text-secondary mb-3">QUILTING</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-20 bg-primary text-white text-center">
                <div className="container-custom max-w-3xl">
                    <h3 className="text-3xl font-heading font-bold mb-6">Craft & Hobby Classes at Tsala Studio</h3>
                    <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
                        Do you want to learn stitching, quilting, pursue a hobby from basics or would like to fine tune your creative skills?
                        Join our Art and Craft classes in Bangalore coz... #hobbyisfun
                    </p>
                    <Link href="/contact" className="btn bg-white text-primary hover:bg-gray-100">
                        Contact for Classes
                    </Link>
                </div>
            </div>
        </div>
    );
}
