'use client';
import React, { useEffect, useState } from 'react';
import StatsSection from '@/components/home/StatsSection';
import config from '../../config.json';
import Link from 'next/link';
import { getItemsById } from '../../services/api';

export default function AboutPage() {
    const [aboutData, setAboutData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const data = await getItemsById('about-us-main');
                if (data) {
                    setAboutData(data);
                }
            } catch (error) {
                console.error("Failed to fetch about data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAbout();
    }, []);

    const description = aboutData[0]?.description;
    const imageUrl = aboutData[0]?.imageUrl;

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
                                className="w-auto h-80 object-cover rounded-[1rem] shadow-xl mx-auto"
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
