'use client';
import React from 'react';
import config from '../../config.json';
import { SparklesIcon, ScissorsIcon, SwatchIcon } from '@heroicons/react/24/outline';

const AboutQuilting = () => {
    const features = [
        {
            icon: <SwatchIcon className="w-8 h-8 text-white" />,
            title: "The Process",
            text: config.about_ABOUTQUILTING1,
            color: "bg-rose-500"
        },
        {
            icon: <ScissorsIcon className="w-8 h-8 text-white" />,
            title: "The Craft",
            text: config.about_ABOUTQUILTING2,
            color: "bg-amber-500"
        },
        {
            icon: <SparklesIcon className="w-8 h-8 text-white" />,
            title: "The Methods",
            text: config.about_ABOUTQUILTING3,
            color: "bg-teal-500"
        }
    ];

    return (
        <section className="section-padding bg-white overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

            <div className="container-custom relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left: Image with organic shape */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-[2rem] transform rotate-3 opacity-20"></div>
                            <img
                                src={config.aboutus_imageurl1}
                                alt="Quilting at Tsala"
                                className="relative rounded-[2rem] shadow-2xl w-full h-[500px] object-cover border-8 border-white"
                            />
                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <SparklesIcon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Experience</p>
                                    <p className="text-lg font-bold font-heading text-gray-900">Premium Quality</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div>
                            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wide uppercase mb-3">
                                Handmade Happiness
                            </span>
                            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 leading-tight">
                                About Quilting?
                            </h2>
                            <div className="h-1.5 w-24 bg-secondary mt-4 rounded-full"></div>
                        </div>

                        <div className="space-y-6">
                            {features.map((feature, idx) => (
                                <div key={idx} className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-300">
                                    <div className={`flex-shrink-0 w-14 h-14 ${feature.color} rounded-xl shadow-md flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed font-sans">
                                            {feature.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutQuilting;
