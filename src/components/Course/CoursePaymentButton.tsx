'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

interface CoursePaymentButtonProps {
    course: any;
    className?: string; // Allow custom styling
}

export default function CoursePaymentButton({ course, className = '' }: CoursePaymentButtonProps) {
    const router = useRouter();
    const { addToCart } = useCart();

    const isPastDate = (dateString: string) => {
        if (!dateString) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(dateString) < today;
    };

    const isExpired = isPastDate(course.coursedate);
    const hasPrice = course.price && Number(course.price) > 0;

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent parent Link click if inside a card
        e.stopPropagation();

        if (isExpired || !hasPrice) return;

        // Add to cart
        addToCart({
            id: course.id || course.post_id,
            name: course.posttitle,
            price: Number(course.price),
            image: course.post_image,
            quantity: 1,
            // You might want to pass 'type: course' if your cart supports metadata, 
            // but standard items work fine.
        });

        // Redirect to checkout
        router.push('/shop/checkout');
    };

    // If no price, maybe show "Free" or nothing? User said "using price tag".
    if (!hasPrice) {
        return (
            <span className={`inline-block px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-bold ${className}`}>
                Free / Contact
            </span>
        );
    }

    if (isExpired) {
        return (
            <button
                disabled
                className={`inline-block px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-bold cursor-not-allowed ${className}`}
            >
                Event Ended
            </button>
        );
    }

    return (
        <button
            onClick={handleBuyNow}
            className={`
                group flex items-center gap-2 px-6 py-2.5 rounded-full 
                bg-primary text-white font-bold text-sm shadow-md 
                hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 
                transition-all duration-300 z-30 relative
                ${className}
            `}
        >
            <span>Book Now</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-white">₹{course.price}</span>
            <ShoppingCartIcon className="w-4 h-4 ml-1" />
        </button>
    );
}
