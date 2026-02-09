'use client';
import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const stats = [
    { label: 'Years of Experience', value: 10, suffix: '+' },
    { label: 'Awards Won', value: 10, suffix: '' },
    { label: 'Happy Clients', value: 1000, suffix: '+' },
];

const StatsSection = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <section className="py-20 bg-primary text-white" ref={ref}>
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-heading font-bold text-white">Milestones</h2>
                    <p className="text-indigo-200 mt-2">More than 1000+ customers trusted us</p>
                </div>

                <div className="flex flex-row justify-between md:justify-center gap-4 md:gap-12 overflow-x-auto px-4 pb-4 md:pb-0 scrollbar-hide">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex-shrink-0 flex flex-col items-center justify-center w-28 h-28 md:w-40 md:h-40 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 group">
                            <div className="text-2xl md:text-4xl font-bold text-light group-hover:scale-110 transition-transform">
                                {inView ? (
                                    <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} />
                                ) : (
                                    <span>0</span>
                                )}
                            </div>
                            <div className="text-xs md:text-sm text-gray-200 font-medium text-center mt-1 px-2 leading-tight">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
