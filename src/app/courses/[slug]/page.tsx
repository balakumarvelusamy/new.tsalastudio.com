import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import config from '../../../config.json';
import { getItemsByType, getItemBySlug } from '../../../services/api';
import { Metadata } from 'next';
import BlurImage from '../../../components/Element/BlurImage';
import CoursePaymentButton from '../../../components/Course/CoursePaymentButton';

type Props = {
    params: Promise<{ slug: string }>;
};

// Helper to normalize data to array
function normalizeData(data: any): any[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return [data];
}

// Dynamic SEO - uses first item if multiple
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = (await params).slug;
    const data = await getItemBySlug(slug);
    const courses = normalizeData(data);
    const course = courses[0];

    if (!course) {
        return { title: 'Course Not Found' };
    }

    const strippedDesc = course.postcontent
        ? course.postcontent.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...'
        : 'Join our course at Tsala Studio';

    return {
        title: `${course.posttitle} | Tsala Studio`,
        description: strippedDesc,
        openGraph: {
            title: course.posttitle,
            description: strippedDesc,
            images: course.post_image ? [course.post_image] : [],
        },
    };
}

export default async function CourseDetailPage({ params }: Props) {
    const slug = (await params).slug;
    const rawData = await getItemBySlug(slug);
    const courses = normalizeData(rawData);

    if (!courses || courses.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md mx-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold font-heading text-gray-900 mb-2">Course Not Found</h2>
                    <p className="text-gray-500 mb-6">
                        We couldn't find the course you're looking for. It might have been removed or is unavailable.
                    </p>
                    <Link href="/courses" className="btn bg-primary text-white hover:bg-primary-dark">
                        Browse All Courses
                    </Link>
                </div>
            </div>
        );
    }

    // Determine if we should show "Related Courses" (only if we are showing a single main course? 
    // Or always? User didn't specify, but let's keep it simple. If multiple courses shown, maybe skip related or show at bottom.)
    // For now, we will render the list of courses found.

    return (
        <div>
            {courses.map((course: any, index: number) => (
                <div key={course.id || course.post_id || index} className="mb-20 border-b-8 border-gray-100 last:border-0 pb-20 last:pb-0">
                    {/* Banner with Background Image */}
                    <div className="relative py-32 bg-gray-900 overflow-hidden">
                        {course.post_image && (
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={course.post_image}
                                    alt={course.posttitle}
                                    className="w-full h-full object-cover opacity-40 blur-sm scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60" />
                            </div>
                        )}

                        <div className="container-custom relative z-10 text-center">
                            {course.postsubcategory && (
                                <span className="inline-block bg-secondary text-white px-3 py-1 rounded-full text-sm font-bold uppercase mb-6 tracking-wide shadow-lg">
                                    {course.postsubcategory}
                                </span>
                            )}
                            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 drop-shadow-md max-w-4xl mx-auto">
                                {course.posttitle}
                            </h1>
                            <div className="flex justify-center gap-2 text-sm uppercase tracking-wider text-gray-300">
                                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                                <span>/</span>
                                <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                                <span>/</span>
                                <span className="text-secondary">{course.displaydate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Course Content */}
                    <div className="section-padding bg-white">
                        <div className="container-custom max-w-4xl">
                            <div className="flex flex-col md:flex-row gap-12">

                                {/* Main Content Info */}
                                <div className="md:w-3/4">
                                    {course.post_image && (
                                        <div className="mb-8 rounded-xl overflow-hidden shadow-lg bg-gray-100">
                                            <img
                                                src={course.post_image}
                                                alt={course.posttitle}
                                                loading="lazy"
                                                className="w-full h-auto aspect-video object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="prose prose-lg prose-indigo max-w-none">
                                        <div dangerouslySetInnerHTML={{ __html: course.postcontent }} />
                                    </div>

                                    <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-gray-100 pt-8">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <CoursePaymentButton course={course} className="!px-8 !py-3 text-base" itemType={course.itemtype || 'course'} />
                                            <a
                                                href={`https://wa.me/919880162266?text=Hi, I am interested in the ${course.posttitle} course.`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn bg-green-500 text-white hover:bg-green-600 border-none text-center px-6 py-3 rounded-full font-bold flex items-center gap-2"
                                            >
                                                <span>Chat on WhatsApp</span>
                                            </a>
                                        </div>

                                        {/* Share Buttons */}
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-bold text-gray-500 uppercase">Share:</span>
                                            <a
                                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${config.domain}/courses/${slug}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-[#1877F2] transition-colors p-2 bg-gray-50 rounded-full hover:bg-blue-50"
                                                title="Share on Facebook"
                                            >
                                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                            </a>
                                            <a
                                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(course.posttitle)}&url=${encodeURIComponent(`${config.domain}/courses/${slug}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-black transition-colors p-2 bg-gray-50 rounded-full hover:bg-gray-200"
                                                title="Share on X (Twitter)"
                                            >
                                                {/* X Logo */}
                                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar Info */}
                                <div className="md:w-1/4 space-y-8">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
                                        <h3 className="text-xl font-bold font-heading mb-4 text-primary">Details</h3>
                                        <ul className="space-y-4 text-sm text-gray-600">

                                            <li className="flex flex-col border-b border-gray-200 pb-3">
                                                <span className="font-bold text-gray-800 uppercase text-xs mb-1">Category</span>
                                                <span>{course.postsubcategory}</span>
                                            </li>
                                            <li className="flex flex-col">
                                                <span className="font-bold text-gray-800 uppercase text-xs mb-1">Status</span>
                                                <span className={`font-bold ${course.isregistrationopen === 1 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {course.isregistrationopen === 1 ? 'Open for Registration' : 'Closed'}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
