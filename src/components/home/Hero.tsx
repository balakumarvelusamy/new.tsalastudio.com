'use client';
import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import config from '../../config.json';
import Link from 'next/link';

const Hero = () => {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);

    return (
        <div className="relative bg-white text-white overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
                {config.slider.map((slide, index) => (
                    <div key={index} className="flex-[0_0_100%] min-w-0 relative h-[600px] flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${slide.image_url})` }}
                        />
                        <div className="absolute inset-0 bg-black/10" /> {/* Overlay */}
                        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
                            <span className="text-secondary font-bold tracking-wider uppercase">{slide.prefix}</span>
                            <h1 className="text-5xl md:text-7xl font-bold font-slider leading-tight">{slide.title}</h1>
                            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">{slide.description}</p>
                            <div className="pt-4">
                                <Link href="/courses" className="btn btn-primary mr-4">
                                    Explore Courses
                                </Link>
                                <Link href="/shop" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary">
                                    Shop Now
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hero;
