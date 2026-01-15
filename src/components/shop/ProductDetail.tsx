'use client';
import React, { useState } from 'react';
import config from '../../config.json';
import { useRouter } from 'next/navigation';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';

interface Product {
    id: string;
    p_id?: string;
    p_name: string;
    p_image: string;
    p_price: number | string;
    p_description: string;
    moreimageurl?: string[];
    p_quantity?: number;
}

interface Review {
    name: string;
    rating: number;
    comments: string;
    displaydate: string;
}

const ProductDetail = ({ product, reviews, relatedProducts }: { product: Product, reviews: Review[], relatedProducts: any[] }) => {
    const [isAdded, setIsAdded] = useState(false);
    const [feedbackText, setFeedbackText] = useState('Added to Cart');
    const [activeImage, setActiveImage] = useState(product.p_image);
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { addToCart: addToContextCart } = useCart();

    const addToCart = async () => {
        // Always add to local context first for immediate UI feedback
        const result = addToContextCart({
            id: product.id || product.p_id || '', // Fallback to p_id if id is missing
            name: product.p_name,
            image: product.p_image,
            price: Number(product.p_price),
            quantity: 1
        });

        setFeedbackText(result === 'updated' ? 'Quantity Updated' : 'Added to Cart');
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 5000);

        const userId = localStorage.getItem('uuid');

        // If logged in, also sync with backend
        if (userId) {
            setLoading(true);
            try {
                const payload = {
                    userid: userId,
                    createddate: new Date(),
                    isactive: '1',
                    p_id: product.p_id || product.id, // Ensure we send an ID
                    p_quantity: 1,
                    updateddate: new Date(),
                    p_price: product.p_price,
                    id: crypto.randomUUID(),
                };

                const res = await fetch(`${config.service_url_prod}/addCart`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: payload })
                });

                if (res.ok) {
                    // window.dispatchEvent(new Event('cartUpdated')); // No longer needed as context handles it
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col gap-12">
            {/* Top Section */}
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Gallery */}
                <div className="w-full lg:w-1/2 space-y-4">
                    <div className="aspect-square rounded-xl overflow-hidden border border-gray-100 bg-white p-4">
                        <img src={activeImage} alt={product.p_name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        <button onClick={() => setActiveImage(product.p_image)} className={`w-20 h-20 rounded-lg border-2 flex-shrink-0 bg-white p-1 overflow-hidden ${activeImage === product.p_image ? 'border-primary' : 'border-transparent'}`}>
                            <img src={product.p_image} alt="Main" className="w-full h-full object-cover" />
                        </button>
                        {product.moreimageurl?.map((img, i) => (
                            <button key={i} onClick={() => setActiveImage(img)} className={`w-20 h-20 rounded-lg border-2 flex-shrink-0 bg-white p-1 overflow-hidden ${activeImage === img ? 'border-primary' : 'border-transparent'}`}>
                                <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <h1 className="text-3xl font-heading font-bold text-gray-900">{product.p_name}</h1>
                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <StarIcon key={s} className="w-5 h-5" />
                            ))}
                        </div>
                        <span className="text-gray-500 text-sm">({reviews.length} Reviews)</span>
                    </div>
                    <div className="text-3xl font-bold text-secondary">
                        ₹{Number(product.p_price).toFixed(2)}
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={addToCart}
                            disabled={loading || isAdded}
                            className={`btn w-full py-4 text-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 ${isAdded
                                ? 'bg-green-600 border-green-600 text-white cursor-default hover:bg-green-600 hover:border-green-600'
                                : 'btn-primary'
                                }`}
                        >
                            {loading ? 'Adding...' : isAdded ? feedbackText : 'Add to Cart'}
                        </button>
                    </div>



                    {/* Description in Side Column */}
                    <div className="pt-4 border-t">
                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                        <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: product.p_description }} />
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t pt-12">
                <h3 className="text-2xl font-bold font-heading mb-8">Customer Reviews ({reviews.length})</h3>
                <div className="space-y-6">
                    {reviews.length > 0 ? reviews.map((r, i) => (
                        <div key={i} className="bg-gray-50 p-6 rounded-xl">
                            <div className="flex justify-between mb-2">
                                <h4 className="font-bold">{r.name}</h4>
                                <span className="text-sm text-gray-500">{r.displaydate}</span>
                            </div>
                            <div className="flex text-yellow-500 mb-2">
                                {[...Array(5)].map((_, si) => (
                                    <StarIcon key={si} className={`w-4 h-4 ${si < r.rating ? '' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <p className="text-gray-600">{r.comments}</p>
                        </div>
                    )) : (
                        <p className="text-gray-500">No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
