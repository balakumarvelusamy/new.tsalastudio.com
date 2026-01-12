import React from 'react';
import StatsSection from '@/components/home/StatsSection';
import config from '../../config.json';
import Link from 'next/link';

export const metadata = {
    title: 'About Us | Tsala Studio',
    description: 'Learn more about Tsala Quilting Studio, our founder Vatsala Kamat, and our mission.',
};

export default function AboutPage() {
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
                    <h1 className="text-5xl font-heading font-bold mb-4">About Us</h1>
                    <div className="flex justify-center gap-2 text-sm uppercase tracking-wider text-gray-300">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <span>/</span>
                        <span>About Us</span>
                    </div>
                </div>
            </div>

            {/* Intro */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        {/* Logo if needed */}
                        <p className="text-xl text-gray-700 leading-relaxed font-medium">
                            {config.aboutus_aboutpage}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <img src={config.aboutus_imageurl1} alt="Studio" className="rounded-xl shadow-lg w-full h-80 object-cover" />
                        <img src={config.aboutus_imageurl2} alt="Vatsala Kamat" className="rounded-xl shadow-lg w-full h-80 object-cover" />
                    </div>

                    {/* Offerings */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">Tsala Studio Offerings</h2>
                        <div className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100">
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Regular in-house quilting & hobby classes",
                                    "Workshops by well known artisans and experts",
                                    "Sales and service of Bernina & Bernette sewing machines",
                                    "Custom orders for quilts, bags, and home decor",
                                    "Studio rental options",
                                    "Sales of quilt fabrics, batting, and sewing supplies"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="text-secondary mt-1">✦</span>
                                        <span className="text-lg text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 text-center">
                                <Link href="/services" className="btn btn-primary">
                                    View All Hobby Classes
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Founder */}
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl font-heading font-bold text-primary mb-6">About Vatsala Kamat</h2>
                            <div className="prose prose-lg text-gray-600">
                                <p className="mb-4">
                                    Hi..! I am <strong className="text-primary">Vatsala Kamat</strong> and Crafting is my Art of Living. It all started during my childhood at Mysore, where I observed my mother engrossed in various handicrafts.
                                </p>
                                <p className="mb-4">
                                    Directed by destiny towards crafting, I have enjoyed handcrafting for more than <strong>40 years</strong>. Knitting, Tatting, Sewing, Patchwork, Macrame Art, Hand Embroidery, and Applique are some of the art forms I cherish.
                                </p>
                                <p className="mb-4">
                                    Travelling around the globe introduced me to varied local crafts and influenced my urge to try something different, leading to Quilting.
                                </p>
                                <p className="mb-6">
                                    <strong>Tsala Studio</strong> is my brainchild, an exclusive creative space for all who wish to experience the magic of handmade creations.
                                </p>
                                <p>
                                    <a href={`mailto:${config.contact_email}`} className="text-secondary hover:underline font-semibold">{config.contact_email}</a>
                                </p>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <img src={config.aboutus_imageurl2} alt="Vatsala Kamat" className="rounded-xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 w-full" />
                        </div>
                    </div>
                </div>
            </section>

            <StatsSection />
        </div>
    );
}
