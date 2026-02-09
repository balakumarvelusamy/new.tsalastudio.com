'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getItemsByType, saveItem, deleteItem, getSecrets } from '../../../services/api';
import { uploadToS3, deleteFromS3 } from '../s3Utils';
import { compressImage } from '../imageUtils';
import { TrashIcon, PencilSquareIcon, PlusIcon, PhotoIcon } from '@heroicons/react/24/outline';

const SLIDER_TYPE = 'slider';

interface SliderItem {
    id: string;
    title: string;
    description: string;
    prefix: string;
    image_url: string;
    isactive: string; // '1' or '0'
    createddate: string;
    type: string;
    button_text?: string;
    button_link?: string;
}

export default function SliderPage() {
    const [slides, setSlides] = useState<SliderItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingItem, setEditingItem] = useState<SliderItem | null>(null);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [secrets, setSecrets] = useState<any>(null);

    useEffect(() => {
        fetchSlides();
        fetchSecrets();
    }, []);

    const fetchSecrets = async () => {
        try {
            const data = await getSecrets();
            setSecrets(data);
        } catch (e) {
            console.error("Failed to load secrets", e);
        }
    };

    const fetchSlides = async () => {
        setLoading(true);
        try {
            const data = await getItemsByType(SLIDER_TYPE);
            // sort by createddate desc or custom order
            const sorted = data.sort((a: any, b: any) => new Date(b.createddate).getTime() - new Date(a.createddate).getTime());
            setSlides(sorted);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: any) => {
        if (!secrets) {
            alert("Secrets not loaded. Cannot upload.");
            return;
        }

        if (slides.length >= 10 && !editingItem) {
            alert("Maximum 10 slides allowed. Please delete or edit existing ones.");
            return;
        }

        setUploading(true);
        try {
            let imageUrl = editingItem?.image_url || '';

            if (imageFile) {
                const compressed = await compressImage(imageFile);
                imageUrl = await uploadToS3(compressed, `slider-${Date.now()}.jpg`, secrets, 'slider');
            }

            if (!imageUrl) {
                alert("Please upload an image.");
                setUploading(false);
                return;
            }

            const payload = {
                id: editingItem ? editingItem.id : crypto.randomUUID(),
                title: data.title,
                description: data.description,
                prefix: data.prefix,
                image_url: imageUrl,
                isactive: data.isactive ? '1' : '0',
                type: SLIDER_TYPE,
                createddate: editingItem ? editingItem.createddate : new Date().toISOString(),
                updateddate: new Date().toISOString(),
                button_text: data.button_text,
                button_link: data.button_link
            };

            await saveItem(payload);
            resetForm();
            fetchSlides();
        } catch (e) {
            console.error(e);
            alert("Failed to save slide.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        if (confirm("Are you sure you want to delete this slide?")) {
            if (secrets && imageUrl) {
                await deleteFromS3(imageUrl, secrets);
            }
            await deleteItem(id);
            fetchSlides();
        }
    };

    const handleEdit = (item: SliderItem) => {
        setEditingItem(item);
        setValue('title', item.title);
        setValue('description', item.description);
        setValue('prefix', item.prefix);
        setValue('isactive', item.isactive === '1');
        setValue('button_text', item.button_text || '');
        setValue('button_link', item.button_link || '/courses'); // Default fallback
        setImageFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingItem(null);
        setImageFile(null);
        reset();
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold font-heading mb-6">Manage Home Slider</h1>

            {/* Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-semibold mb-4">{editingItem ? 'Edit Slide' : 'Add New Slide'}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prefix / Tag</label>
                            <input
                                {...register('prefix')}
                                placeholder="e.g. New Arrival"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                {...register('title', { required: true })}
                                placeholder="Slide Title"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                            />
                            {errors.title && <span className="text-red-500 text-xs">Title is required</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Button Name</label>
                            <input
                                {...register('button_text')}
                                placeholder="e.g. Explore Courses"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Button Navigation Page</label>
                            <select
                                {...register('button_link')}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                            >
                                <option value="/courses">Courses</option>
                                <option value="/workshops">Workshops</option>
                                <option value="/shop">Shop</option>
                                <option value="/blog">Blog</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            placeholder="Short description"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                            <div className="flex items-center gap-2">
                                <label className="cursor-pointer btn btn-outline py-2 px-4 text-sm">
                                    <PhotoIcon className="w-5 h-5 mr-2 inline" />
                                    Choose Image
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                    />
                                </label>
                                {imageFile && <span className="text-sm text-gray-500">{imageFile.name}</span>}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('isactive')}
                                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                        </div>
                    </div>

                    {/* Preview Existing Image if Editing */}
                    {editingItem && !imageFile && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                            <img src={editingItem.image_url} alt="Current" className="h-20 w-auto rounded border" />
                        </div>
                    )}

                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="btn btn-primary"
                        >
                            {uploading ? 'Saving...' : (editingItem ? 'Update Slide' : 'Add Slide')}
                        </button>
                        {editingItem && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="space-y-4">
                {loading ? (
                    <p>Loading slides...</p>
                ) : slides.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No slides found. Add one above.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {slides.map((slide) => (
                            <div key={slide.id} className={`bg-white rounded-xl shadow border overflow-hidden relative ${slide.isactive === '1' ? 'border-gray-200' : 'border-red-200 opacity-75'}`}>
                                <div className="h-48 bg-gray-100 relative">
                                    <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button onClick={() => handleEdit(slide)} className="p-2 bg-white/90 rounded-full shadow hover:text-primary">
                                            <PencilSquareIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(slide.id, slide.image_url)} className="p-2 bg-white/90 rounded-full shadow hover:text-red-500">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                                        {slide.isactive === '1' ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-secondary font-bold uppercase mb-1">{slide.prefix}</p>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{slide.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2">{slide.description}</p>
                                    <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                                        <span>Btn: {slide.button_text || 'Default'}</span>
                                        <span>Link: {slide.button_link || '/courses'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
