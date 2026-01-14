
import Link from 'next/link';

interface Product {
    p_id: string;
    p_name: string;
    p_price: string;
    p_actual_price: string;
    p_image: string;
    p_category: string;
}

const ProductCard = ({ product }: { product: Product }) => {
    // Helper to generate SEO friendly slug
    const slug = product.p_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md flex flex-col h-full group">
            <Link href={`/shop/${slug}`} className="relative aspect-square overflow-hidden bg-gray-100 block">
                {product.p_image ? (
                    <img
                        src={product.p_image}
                        alt={product.p_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                        No Image
                    </div>
                )}
                {product.p_actual_price && Number(product.p_actual_price) > Number(product.p_price) && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        Sale
                    </div>
                )}
            </Link>

            <div className="p-3 flex flex-col flex-1">
                <div className="mb-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">{product.p_category}</span>
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 min-h-[36px] hover:text-secondary transition-colors">
                        <Link href={`/shop/${product.p_id}-${slug}`}>
                            {product.p_name}
                        </Link>
                    </h3>
                </div>

                <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">₹{product.p_price}</span>
                        {product.p_actual_price && Number(product.p_actual_price) > Number(product.p_price) && (
                            <span className="text-[10px] text-gray-400 line-through">₹{product.p_actual_price}</span>
                        )}
                    </div>

                    <a
                        href={`https://wa.me/919880162266?text=Hi, I am interested in ${product.p_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary text-xs px-3 py-1.5 rounded h-8 flex items-center justify-center whitespace-nowrap"
                        title="Add to Cart"
                    >
                        Add to Cart
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
