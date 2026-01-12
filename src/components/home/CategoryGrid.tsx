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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((cat, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-96">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url(${cat.imageurl})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                            <div className="absolute bottom-0 left-0 right-0 p-6 text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                <h3 className="text-xl font-bold mb-2 text-white">{cat.title}</h3>
                                <p className="text-sm text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">{cat.subtitle}</p>
                                {cat.category.toLowerCase() === 'course' ? (
                                    <Link href="/courses" className="inline-block px-4 py-2 bg-secondary text-white text-sm font-semibold rounded hover:bg-secondary-light transition-colors">
                                        View Courses
                                    </Link>
                                ) : (
                                    <Link href={`/shop?category=${cat.category}`} className="inline-block px-4 py-2 bg-white text-primary text-sm font-semibold rounded hover:bg-gray-100 transition-colors">
                                        Shop {cat.category}
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
