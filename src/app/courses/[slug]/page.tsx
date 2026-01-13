import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import coursesData from '../../../data/courses.json';
import config from '../../../config.json';
import { Metadata } from 'next';
import BlurImage from '../../../components/Element/BlurImage';

type Props = {
    params: Promise<{ slug: string }>;
};

// Data Helper
async function getCourse(slug: string) {
    return coursesData.find((c: any) => c.slug === slug);
}

// Dynamic SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = (await params).slug;
    const course = await getCourse(slug);

    if (!course) {
        return {
            title: 'Course Not Found',
        };
    }

    // Strip HTML for description
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
    const course = await getCourse(slug);

    if (!course) {
        notFound();
    }

    return (
        <div>
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
                                    <BlurImage
                                        src={course.post_image}
                                        alt={course.posttitle}
                                        loading="lazy"
                                        className="w-full h-auto aspect-video"
                                    />
                                </div>
                            )}
                            <div className="prose prose-lg prose-indigo max-w-none">
                                {/* Use dangerouslySetInnerHTML for HTML content */}
                                <div dangerouslySetInnerHTML={{ __html: course.postcontent }} />
                            </div>

                            <div className="mt-12 flex flex-col sm:flex-row gap-4">
                                <a
                                    href={`https://wa.me/919880162266?text=Hi, I am interested in the ${course.posttitle} course.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn bg-green-500 text-white hover:bg-green-600 border-none text-center"
                                >
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="md:w-1/4 space-y-8">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
                                <h3 className="text-xl font-bold font-heading mb-4 text-primary">Details</h3>
                                <ul className="space-y-4 text-sm text-gray-600">
                                    <li className="flex flex-col border-b border-gray-200 pb-3">
                                        <span className="font-bold text-gray-800 uppercase text-xs mb-1">Date</span>
                                        <span>{course.displaydate}</span>
                                    </li>
                                    <li className="flex flex-col border-b border-gray-200 pb-3">
                                        <span className="font-bold text-gray-800 uppercase text-xs mb-1">Category</span>
                                        <span>{course.postsubcategory}</span>
                                    </li>
                                    <li className="flex flex-col">
                                        <span className="font-bold text-gray-800 uppercase text-xs mb-1">Status</span>
                                        <span className={`font-bold ${course.isactive ? 'text-green-600' : 'text-red-600'}`}>
                                            {course.isactive ? 'Open for Registration' : 'Closed'}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Related/Other Courses (Simple implementation: just recent 3) */}
            <div className="section-padding bg-gray-50 border-t border-gray-200">
                <div className="container-custom">
                    <h2 className="text-3xl font-heading font-bold text-center mb-12">Explore More Courses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {coursesData
                            .filter((c: any) => c.slug !== course.slug && c.isactive === 1 && c.published === 1 && c.posttypevalue === 'course')
                            .slice(0, 3)
                            .map((relCourse: any) => (
                                <Link
                                    href={`/courses/${relCourse.slug}`}
                                    key={relCourse.post_id}
                                    className="block group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors z-10" />
                                        <img
                                            src={relCourse.post_image}
                                            alt={relCourse.posttitle}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold font-heading mb-2 group-hover:text-primary truncate">
                                            {relCourse.posttitle}
                                        </h4>
                                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                                            {relCourse.displaydate}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
