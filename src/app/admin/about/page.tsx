'use client';
import React, { useState, useEffect } from 'react';
import { saveItem, getItemsById, getSecrets } from '../../../services/api';
import { compressImage } from '../imageUtils';
import { uploadToS3 } from '../s3Utils';
import { PhotoIcon } from '@heroicons/react/24/outline';
import AdminGuard from '../AdminGuard';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function AdminAboutPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [secret, setSecret] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState('');

    const [formData, setFormData] = useState({
        id: 'about-us-main',
        type: 'about_content',
        description: '',
        imageUrl: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [data, secrets] = await Promise.all([
                    getItemsById('about-us-main'),
                    getSecrets()
                ]);

                if (data) {
                    const item = Array.isArray(data) ? data[0] : data;
                    if (item) {
                        setFormData({
                            id: 'about-us-main',
                            type: 'about_content',
                            description: item.description || '',
                            imageUrl: item.imageUrl || ''
                        });
                    }
                }
                setSecret(secrets);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({ ...prev, description: content }));
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

                // Preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFormData(prev => ({ ...prev, imageUrl: e.target?.result as string }));
                };
                reader.readAsDataURL(compressed);

                setUploadProgress(''); // Clear status after compression
            } catch (err) {
                console.error("Compression failed", err);
                setFile(originalFile); // Fallback to original
                setUploadProgress('');
            }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let finalImageUrl = formData.imageUrl;

            if (file) {
                if (!secret) {
                    alert("Secrets not loaded. Please refresh.");
                    setSaving(false);
                    return;
                }

                setUploadProgress('Uploading...');
                const filename = `about-us-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
                const uploadedUrl = await uploadToS3(file, filename, secret, 'about');
                if (uploadedUrl) {
                    finalImageUrl = uploadedUrl;
                }
            }

            await saveItem({
                ...formData,
                imageUrl: finalImageUrl
            });

            alert('About Us content updated successfully!');
            setFile(null); // Reset file to avoid re-uploading
        } catch (error) {
            console.error("Failed to save", error);
            alert('Failed to update content');
        } finally {
            setSaving(false);
            setUploadProgress('');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <AdminGuard>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold font-heading text-gray-900">Edit About Us</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">About Image</label>
                            <div className="flex items-center gap-6">
                                <div className="w-40 h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                                    {formData.imageUrl ? (
                                        <img src={formData.imageUrl} alt="About" className="w-full h-full object-cover" />
                                    ) : (
                                        <PhotoIcon className="w-10 h-10 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-primary/10 file:text-primary
                                            hover:file:bg-primary/20
                                        "
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Recommended size: 800x600px</p>
                                    {uploadProgress && <p className="mt-2 text-sm text-blue-600 font-medium">{uploadProgress}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <div className="h-64 mb-12">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={handleContentChange}
                                    modules={quillModules}
                                    className="h-full"
                                />
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div className="pt-8 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Live Preview</h3>
                            <div className="rounded-xl p-6 border border-gray-200">
                                <div className="prose prose-lg max-w-none">
                                    {formData.imageUrl && (
                                        <div className="mb-6 flex justify-center">
                                            <img
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                className="rounded-xl shadow-lg max-h-96 object-cover"
                                            />
                                        </div>
                                    )}
                                    <div dangerouslySetInnerHTML={{ __html: formData.description }} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminGuard>
    );
}
