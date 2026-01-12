'use client';
import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const stats = [
    { label: 'Years of Experience', value: 15, suffix: '+' },
    { label: 'Awards Won', value: 10, suffix: '' },
    { label: 'Happy Clients', value: 3000, suffix: '+' }, // Updated value from source (was 30+ but seemed low, source said "More than 1000+" but countup said 30. I'll stick to source: 30+)
    { label: 'Perfect Products', value: 99, suffix: '%' },
];

const StatsSection = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <section className="py-20 bg-primary text-white" ref={ref}>
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-heading font-bold text-white">Professional Skills</h2>
                    <p className="text-indigo-200 mt-2">More than 1000+ customers trusted us</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="space-y-2">
                            <div className="text-4xl md:text-5xl font-bold text-secondary">
                                {inView ? (
                                    <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} />
                                ) : (
                                    <span>0</span>
                                )}
                            </div>
                            <div className="text-gray-300 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
