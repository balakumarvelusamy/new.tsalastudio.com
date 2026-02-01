import React from 'react';
import Link from 'next/link';
import { getItemsByType } from '../../services/api';
import ProductCard from '../../components/shop/ProductCard';
import BlurImage from '../../components/Element/BlurImage';
import CoursePaymentButton from '../../components/Course/CoursePaymentButton';

export const metadata = {
    title: 'Search Results | Tsala Studio',
    description: 'Search results for courses, workshops, and products.',
};

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.q?.toLowerCase() || '';

    // Fetch all data
    // Optimally we'd have a search API, but fetching all client-side logic server-side works for small datasets
    const [products, courses, workshops] = await Promise.all([
        getItemsByType('product'),
        getItemsByType('course'),
        getItemsByType('workshop')
    ]);

    // Filter Functions
    const filterAndSort = (items: any[], type: 'product' | 'course' | 'workshop') => {
        if (!Array.isArray(items)) return [];
        return items.filter(item => {
            const term = query.trim();
            if (!term) return false;

            if (type === 'product') {
                return (
                    (item.p_name && item.p_name.toLowerCase().includes(term)) ||
                    (item.p_description && item.p_description.toLowerCase().includes(term)) ||
                    (item.p_category && item.p_category.toLowerCase().includes(term))
                );
            } else {
                // Courses and Workshops share structure
                const isActive = item.isactive === 1 && item.published === 1;
                if (!isActive) return false;

                return (
                    (item.posttitle && item.posttitle.toLowerCase().includes(term)) ||
                    (item.postcontent && item.postcontent.toLowerCase().includes(term)) ||
                    (item.postsubcategory && item.postsubcategory.toLowerCase().includes(term))
                );
            }
        });
    };

    const foundProducts = filterAndSort(products, 'product');
    const foundCourses = filterAndSort(courses, 'course');
    const foundWorkshops = filterAndSort(workshops, 'workshop');

    const hasResults = foundProducts.length > 0 || foundCourses.length > 0 || foundWorkshops.length > 0;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Banner */}
            <div className="relative py-16 bg-[#1d788f] text-white">
                <div className="container-custom relative z-10">
                    <h1 className="text-3xl font-heading font-bold mb-2">Search Results</h1>
                    <p className="text-gray-200">
                        {query ? `Showing results for "${query}"` : 'Please enter a search term'}
                    </p>
                </div>
            </div>

            <div className="container-custom py-12">
                {!hasResults ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">No results found for "{query}".</p>
                        <p className="text-gray-400 mt-2">Try checking your spelling or using different keywords.</p>
                        <Link href="/" className="mt-6 inline-block btn btn-primary">
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-16">

                        {/* Courses Section */}
                        {foundCourses.length > 0 && (
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <h2 className="text-2xl font-heading font-bold text-gray-800">Courses</h2>
                                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-bold">{foundCourses.length}</span>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {foundCourses.map((course: any) => (
                                        <CourseCard key={course.id || course.post_id} course={course} type="course" />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Workshops Section */}
                        {foundWorkshops.length > 0 && (
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <h2 className="text-2xl font-heading font-bold text-gray-800">Workshops</h2>
                                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-bold">{foundWorkshops.length}</span>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {foundWorkshops.map((workshop: any) => (
                                        <CourseCard key={workshop.id || workshop.post_id} course={workshop} type="workshop" />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Products Section */}
                        {foundProducts.length > 0 && (
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <h2 className="text-2xl font-heading font-bold text-gray-800">Products</h2>
                                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-bold">{foundProducts.length}</span>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {foundProducts.map((product: any) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}

// Reusable Card for Course/Workshop in search results
function CourseCard({ course, type }: { course: any, type: string }) {
    const link = type === 'course' ? `/courses/${course.slug}` : `/courses/${course.slug}`; // Assuming workshops share slug route or logic

    return (
        <Link
            href={link}
            className="block group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col"
        >
            <div className="h-48 overflow-hidden relative">
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
                    <span className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm">
                        {course.postsubcategory}
                    </span>
                )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold font-heading mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {course.posttitle}
                </h3>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <span className="text-sm font-bold text-gray-900">
                        {course.price ? `₹${course.price}` : 'Free/Contact'}
                    </span>
                    <span className="text-primary text-xs font-bold uppercase group-hover:underline">
                        View Details
                    </span>
                </div>
            </div>
        </Link>
    );
}
