import Link from 'next/link';
import React from 'react';

interface Category {
    title: string;
    subtitle: string;
    imageurl: string;
    category: string;
    type: string;
}

const CategoryGrid = ({ categories }: { categories: Category[] }) => {
    return (
        <section className="section-padding bg-gray-50">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-heading font-bold text-primary mb-4">Our Offerings</h2>
                    <div className="h-1 w-20 bg-secondary mx-auto"></div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                    {categories.map((cat, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-full shadow-md hover:shadow-xl transition-all duration-300 w-36 h-36 md:w-72 md:h-72 flex-shrink-0">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url(${cat.imageurl})` }}
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />

                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 md:p-6 text-center text-white">
                                <h3 className="text-xs md:text-xl font-bold mb-1 md:mb-2 text-white leading-tight">{cat.title}</h3>
                                <p className="text-[10px] md:text-sm text-gray-100 mb-1 md:mb-4 text-shadow hidden md:block">{cat.subtitle}</p>

                                <div>
                                    {cat.category.toLowerCase() === 'course' ? (
                                        <Link href="/courses" className="inline-block px-2 py-1 md:px-5 md:py-2 bg-secondary text-white text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full hover:bg-white hover:text-secondary transition-colors shadow-lg">
                                            View Courses
                                        </Link>
                                    ) : (
                                        <Link href={`/shop?category=${cat.category}`} className="inline-block px-2 py-1 md:px-5 md:py-2 bg-white text-primary text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full hover:bg-secondary hover:text-white transition-colors shadow-lg">
                                            Shop Now
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
