'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import config from '../../config.json';
import { useRouter } from 'next/navigation';


interface Product {
    p_id: string;
    p_name: string;
    p_image: string;
    p_short_desc?: string;
    p_price: number | string;
    p_actual_price?: number | string;
    isactive: string | number;
}

const ProductCard = ({ product }: { product: Product }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const formatPrice = (price: any) => {
        const num = Number(price);
        return isNaN(num) ? price : num.toFixed(2);
    };

    const addToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const userId = localStorage.getItem('uuid');
        if (!userId) {
            router.push('/login'); // Redirect to login
            return;
        }

        setLoading(true);
        try {
            const payload = {
                userid: userId,
                createddate: new Date(),
                isactive: '1',
                p_id: product.p_id,
                p_quantity: 1,
                updateddate: new Date(),
                p_price: product.p_price,
                id: crypto.randomUUID(), // Native alternative to react-uuid
            };

            const res = await fetch(`${config.service_url}addCart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: payload })
            });

            const data = await res.json();
            if (data.status === 200) {
                alert("Added to cart!"); // Better would be a toast
                localStorage.setItem('cartUpdated', 'true');
                // Trigger cart update event or context
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                alert("Failed to add to cart or already added.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card group">
            <div className="relative overflow-hidden aspect-square">
                <Link href={`/shop/${product.p_id}`}>
                    <img
                        src={product.p_image}
                        alt={product.p_name}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>
                {/* Badges */}
                {(Number(product.p_actual_price) > Number(product.p_price)) && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                    </div>
                )}

                {/* Quick Action */}
                <div className="absolute bottom-4 right-4 translate-y-20 group-hover:translate-y-0 transition-transform duration-300">
                    <button
                        onClick={addToCart}
                        disabled={loading}
                        className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-secondary transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="p-4 text-center">
                <Link href={`/shop/${product.p_id}`} className="block">
                    <h3 className="text-lg font-bold text-gray-800 hover:text-primary mb-2 line-clamp-1">{product.p_name}</h3>
                </Link>
                <div className="flex justify-center items-center gap-2 text-sm font-medium">
                    {Number(product.p_actual_price) > Number(product.p_price) && (
                        <span className="text-gray-400 line-through">₹{formatPrice(product.p_actual_price)}</span>
                    )}
                    <span className="text-secondary text-lg">₹{formatPrice(product.p_price)}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
