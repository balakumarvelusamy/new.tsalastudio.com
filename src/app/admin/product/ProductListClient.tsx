'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PencilSquareIcon, TrashIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { deleteItem, saveItem, getItemsByType } from '../../../services/api';
import ProductForm from './ProductForm';

interface Product {
    id: string;
    posttitle: string; // Mapped from p_name
    p_image: string; // Mapped from p_image
    p_price: string;
    p_actual_price?: string; // Optional field
    p_category: string;
    isactive: number; // 1 or 0
    type: string;
    createddate: string;
    [key: string]: any;
}

export default function ProductListClient({ initialProducts }: { initialProducts: any[] }) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

        setLoading(true);
        try {
            await deleteItem(id);
            // Optimistic - or just re-fetch
            fetchProducts();
            router.refresh();
        } catch (err) {
            alert('Failed to delete product');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (product: Product, field: 'isactive') => {
        const newValue = product[field] === 1 ? 0 : 1;
        const updatedProduct = { ...product, [field]: newValue };

        // Optimistic update
        setProducts(prev => prev.map(p => (p.id === product.id ? updatedProduct : p)));

        try {
            await saveItem(updatedProduct);
            router.refresh();
        } catch (err) {
            console.error(err);
            setProducts(prev => prev.map(p => (p.id === product.id ? product : p)));
            alert(`Failed to update ${field}`);
        }
    };

    const openModal = (product?: Product) => {
        setEditingProduct(product || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getItemsByType('product');
            const sortedData = Array.isArray(data) ? data.sort((a: any, b: any) =>
                new Date(b.createddate).getTime() - new Date(a.createddate).getTime()
            ) : [];
            setProducts(sortedData);
        } catch (err) {
            console.error("Failed to fetch products", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fix for potential stale data if traversing via client-side nav
        fetchProducts();
    }, []);

    const handleFormSuccess = async () => {
        closeModal();
        await fetchProducts();
        router.refresh();
    };

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.posttitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.p_category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Header / Add Button / Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 mb-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-800">All Products</h2>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {filteredProducts.length}
                    </span>
                </div>

                <div className="flex flex-1 max-w-md w-full gap-2">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        />
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                    >
                        <span>+ Add Product</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Image
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Offer Price
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Active
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                        No products found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-12 w-16 bg-gray-100 rounded-md overflow-hidden relative">
                                                {product.p_image ? (
                                                    <img
                                                        src={product.p_image}
                                                        alt={product.posttitle}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                                        No Img
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-xs" title={product.posttitle}>
                                                {product.posttitle}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.p_category || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(product.createddate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.p_price ? `₹${product.p_price}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.p_actual_price ? (
                                                <span className="line-through text-gray-400">₹{product.p_actual_price}</span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggle(product, 'isactive')}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.isactive === 1
                                                    ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                                                    }`}
                                            >
                                                {product.isactive === 1 ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(product)}
                                                    className="text-primary hover:text-primary/80 p-1 hover:bg-primary/5 rounded-full transition-colors"
                                                    title="Edit"
                                                >
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete"
                                                    disabled={loading}
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
                        >
                            <XMarkIcon className="w-6 h-6 text-gray-600" />
                        </button>
                        <div className="p-1">
                            <ProductForm
                                initialData={editingProduct || undefined}
                                isEditMode={!!editingProduct}
                                onSuccess={handleFormSuccess}
                                onCancel={closeModal}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
