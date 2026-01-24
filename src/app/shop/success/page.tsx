'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderid');

    return (
        <div className="container-custom py-24 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                <CheckCircleIcon className="w-16 h-16 text-green-600" />
            </div>

            <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto mb-8">
                Thank you for your purchase. Your order <span className="font-semibold text-gray-900">#{orderId}</span> has been confirmed.
                We have sent an email confirmation to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/shop" className="btn btn-primary px-8">
                    Continue Shopping
                </Link>
                <Link href="/shop/profile" className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-8">
                    View My Orders
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
