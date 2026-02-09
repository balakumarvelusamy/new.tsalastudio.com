import React from 'react';
import StatsSection from '@/components/home/StatsSection';
import config from '../../config.json';
import Link from 'next/link';
import { getItemsById } from '../../services/api';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    let item = null;
    try {
        const aboutData = await getItemsById('about-us-main');
        item = Array.isArray(aboutData) ? aboutData[0] : aboutData;
    } catch (error) {
        console.error("Metadata fetch error:", error);
    }

    const rawDescription = item?.description || config.aboutus_aboutpage;
    // Strip HTML for meta description
    const plainDescription = rawDescription.replace(/<[^>]*>?/gm, ' ').substring(0, 160).trim();
    const imageUrl = item?.imageUrl || config.aboutus_imageurl2;

    return {
        title: 'About Us | Tsala Studio',
        description: plainDescription,
        openGraph: {
            title: 'About Us | Tsala Studio',
            description: plainDescription,
            images: [
                {
                    url: imageUrl,
                    width: 800,
                    height: 600,
                    alt: 'About Tsala Studio',
                },
            ],
            type: 'website',
        },
    };
}

export default async function AboutPage() {
    let item = null;
    try {
        const aboutData = await getItemsById('about-us-main');
        item = Array.isArray(aboutData) ? aboutData[0] : aboutData;
    } catch (error) {
        console.error("About page fetch error:", error);
    }

    const description = item?.description || config.aboutus_aboutpage;
    const imageUrl = item?.imageUrl || config.aboutus_imageurl2;

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

            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        {/* Logo if needed */}
                        <div className="mb-8 flex justify-center">
                            <img
                                src={imageUrl}
                                alt="About"
                                className="w-auto h-80 object-cover rounded-[2rem] shadow-xl mx-auto"
                            />
                        </div>
                        <div
                            className="text-xl text-gray-700 leading-relaxed font-medium prose prose-lg mx-auto text-left"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    </div>
                </div>
            </section>

            <StatsSection />
        </div>
    );
}
