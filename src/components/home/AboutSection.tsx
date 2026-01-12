import React from 'react';
import config from '../../config.json';
import Link from 'next/link';

const AboutSection = () => {
    return (
        <section className="section-padding bg-white">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-secondary/10 rounded-2xl transform -rotate-3"></div>
                            <img
                                src={config.aboutus_imageurl1 || '/images/about-placeholder.jpg'}
                                alt="About Tsala"
                                className="relative rounded-xl shadow-lg w-full object-cover h-[400px]"
                            />
                            {/* Decorative image */}
                            <img
                                src={config.aboutus_imageurl2}
                                alt="Vatsala"
                                className="absolute -bottom-10 -right-10 w-48 h-48 rounded-lg shadow-xl border-4 border-white object-cover hidden lg:block"
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 space-y-6">
                        <h2 className="text-4xl font-heading font-bold text-primary">
                            {config.aboutustitle}
                        </h2>
                        <p className="text-lg text-secondary font-medium">
                            {config.aboutus1}
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            {config.aboutus_aboutpage}
                        </p>

                        <div className="pt-4">
                            <Link href="/about" className="btn btn-outline">
                                Read More About Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
