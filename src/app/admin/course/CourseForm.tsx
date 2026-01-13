'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveItem, getSecrets } from '../../../services/api';
import { compressImage } from '../imageUtils';
import { uploadToS3 } from '../s3Utils';
import dynamic from 'next/dynamic';
import AWS from 'aws-sdk';
import config from '../../../config.json';

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface CourseFormProps {
    initialData?: any;
    isEditMode?: boolean;
    onSuccess?: () => void;
}

const CATEGORIES = ["Hand Embroidery", "Quilting", "Sewing", "Others"];

export default function CourseForm({ initialData, isEditMode = false, onSuccess }: CourseFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [secret, setSecret] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState('');

    const [formData, setFormData] = useState({
        posttitle: initialData?.posttitle || '',
        slug: initialData?.slug || '',
        postcategory: initialData?.postcategory || 'Course',
        post_image: initialData?.post_image || '',
        postcontent: initialData?.postcontent || '',
        isactive: initialData?.isactive ?? 1,
        published: initialData?.published ?? 1,
        // Hidden/System fields
        type: 'course',
        id: initialData?.id || initialData?.post_id || crypto.randomUUID(),
        createdby: initialData?.createdby || 'Admin',
        createddate: initialData?.createddate || new Date().toISOString(),
        updateddate: new Date().toISOString(),
    });

    // Fetch secrets on mount
    useEffect(() => {
        const fetchSecrets = async () => {
            try {
                const secrets = await getSecrets();
                setSecret(secrets);
            } catch (err) {
                console.error("Failed to load secrets", err);
            }
        };
        fetchSecrets();
    }, []);

    // Auto-populate slug from title
    useEffect(() => {
        if (!isEditMode && formData.posttitle) {
            const slug = formData.posttitle
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.posttitle, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({ ...prev, postcontent: content }));
    };

    const handleToggle = (field: 'isactive' | 'published') => {
        setFormData(prev => ({ ...prev, [field]: prev[field] === 1 ? 0 : 1 }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const originalFile = e.target.files[0];
            try {
                if (originalFile.size > 1024 * 1024) {
                    setUploadProgress('Compressing...');
                }
                const compressed = await compressImage(originalFile);
                setFile(compressed);
                setUploadProgress(''); // Clear status after compression
            } catch (err) {
                console.error("Compression failed", err);
                setFile(originalFile); // Fallback to original
                setUploadProgress('');
            }
        }
    };

    // internal uploadFileToS3 removed, using imported utility

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.post_image;

            if (file) {
                if (!secret) {
                    alert("Secrets not loaded yet. Please try again in a moment.");
                    setLoading(false);
                    return;
                }
                try {
                    const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    const filename = slugify(formData.posttitle) + "-ssndigitalmedia-" + file.name.replace(/\s+/g, "-");

                    setUploadProgress("Uploading 0%");
                    // Note: uploadToS3 currently doesn't support progress callback but works for now.
                    // We can add it to utility if needed, but for small files it's fast.
                    const uploadedUrl = await uploadToS3(file, filename, secret, 'course');
                    if (uploadedUrl) {
                        imageUrl = uploadedUrl;
                    }
                } catch (uploadErr) {
                    console.error(uploadErr);
                    alert("Failed to upload image.");
                    setLoading(false);
                    return;
                }
            }

            const dataToSave = {
                ...formData,
                post_image: imageUrl,
                updateddate: new Date().toISOString()
            };

            await saveItem(dataToSave);

            if (onSuccess) {
                onSuccess();
            } else {
                alert('Course saved successfully!');
                router.push('/admin/course');
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="border-b border-gray-100 pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Course' : 'Create New Course'}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Title */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                    <input
                        type="text"
                        name="posttitle"
                        value={formData.posttitle}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                        placeholder="e.g. Advanced Quilting Techniques"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all bg-gray-50"
                        placeholder="Auto-generated from title"
                    />
                </div>

                {/* Category Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                        name="postcategory"
                        value={formData.postcategory}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Image Upload */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Image</label>
                    <div className="space-y-4">
                        {formData.post_image && (
                            <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                <img src={formData.post_image} alt="Current" className="w-20 h-20 object-cover rounded-md" />
                                <div className="text-xs text-gray-500 break-all">{formData.post_image}</div>
                            </div>
                        )}

                        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-primary/10 file:text-primary
                                hover:file:bg-primary/20"
                            />
                            {uploadProgress && <div className="text-xs text-blue-600 mt-2 font-medium">{uploadProgress}</div>}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <div className="h-64 mb-12">
                        <ReactQuill
                            theme="snow"
                            value={formData.postcontent}
                            onChange={handleContentChange}
                            modules={quillModules}
                            className="h-full"
                        />
                    </div>
                </div>

                {/* Toggles */}
                <div className="col-span-2 flex gap-8 py-4 border-t border-gray-100 mt-8">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isactive === 1 ? 'bg-green-500' : 'bg-gray-300'}`} onClick={() => handleToggle('isactive')}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${formData.isactive === 1 ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.published === 1 ? 'bg-blue-500' : 'bg-gray-300'}`} onClick={() => handleToggle('published')}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${formData.published === 1 ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Published</span>
                    </label>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors font-medium"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors font-medium shadow-sm ${loading ? 'opacity-70 cursor-wait' : ''}`}
                >
                    {loading ? (uploadProgress ? 'Uploading...' : 'Saving...') : 'Save Course'}
                </button>
            </div>
        </form>
    );
}
