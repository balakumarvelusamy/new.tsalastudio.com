import Link from 'next/link';
import React from 'react';

const WhyUs = () => {
    return (
        <section className="section-padding bg-gray-50">
            <div className="container-custom">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl font-heading font-bold text-primary mb-6">Why Tsala?</h2>
                        <p className="text-gray-600 mb-8 text-lg">
                            We believe in motivating and encouraging many minds to come forward and explore their creativity. Only the finest materials and expert guidance await you.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                'Quilting', 'Stitching & Tailoring', 'Bag Making', 'Kids Sewing Workshop',
                                'Knitting', 'Crochet', 'Tatting', 'Hand Embroidery',
                                'Weaving', 'Natural Dying', 'Paper Crafts', 'Macrame'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center text-secondary text-xs">✓</span>
                                    <span className="text-gray-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <Link href="/services" className="btn btn-primary">
                                Get Started
                            </Link>
                        </div>
                    </div>

                    <div className="lg:w-1/2 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-6 text-primary">Frequently Asked Questions</h3>
                        {/* Simple Accordion Placeholder */}
                        <div className="space-y-4">
                            <details className="group p-4 bg-gray-50 rounded-lg open:bg-white open:shadow-sm open:ring-1 open:ring-gray-200 transition-all">
                                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-gray-800">
                                    What are the timings?
                                    <span className="transition group-open:rotate-180">▼</span>
                                </summary>
                                <p className="text-gray-600 mt-3 text-sm">
                                    We are open Monday to Friday from 10 AM to 6 PM. Saturdays are by appointment.
                                </p>
                            </details>
                            <details className="group p-4 bg-gray-50 rounded-lg open:bg-white open:shadow-sm open:ring-1 open:ring-gray-200 transition-all">
                                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-gray-800">
                                    Do you provide materials?
                                    <span className="transition group-open:rotate-180">▼</span>
                                </summary>
                                <p className="text-gray-600 mt-3 text-sm">
                                    Yes, we have kits available for most workshops. You can also bring your own materials or purchase them from our shop.
                                </p>
                            </details>
                            <details className="group p-4 bg-gray-50 rounded-lg open:bg-white open:shadow-sm open:ring-1 open:ring-gray-200 transition-all">
                                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-gray-800">
                                    Is prior experience required?
                                    <span className="transition group-open:rotate-180">▼</span>
                                </summary>
                                <p className="text-gray-600 mt-3 text-sm">
                                    We have courses for all levels, from complete beginners to advanced quilters. Check the specific course details for pre-requisites.
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyUs;
