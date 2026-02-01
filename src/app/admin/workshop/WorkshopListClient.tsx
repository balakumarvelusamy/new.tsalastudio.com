'use client';

import React, { useState, useEffect } from 'react';


import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PencilSquareIcon, TrashIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { deleteItem, saveItem, getItemsByType } from '../../../services/api';
import CourseForm from '../course/CourseForm';

interface Workshop {
    id: string; // Primary Key
    post_id?: string; // Legacy/Secondary Key
    posttitle: string;
    post_image: string;
    isactive: number;
    published: number;
    slug?: string;
    createddate?: string;
    isregistrationopen?: number;
    [key: string]: any;
}

export default function WorkshopListClient({ initialWorkshops }: { initialWorkshops: any[] }) {
    const [workshops, setWorkshops] = useState<Workshop[]>(initialWorkshops);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this workshop? This action cannot be undone.')) return;

        setLoading(true);
        try {
            await deleteItem(id);
            // setWorkshops(prev => prev.filter(c => (c.id || c.post_id) !== id)); // Optimistic local remove
            fetchWorkshops(); // Fetch fresh list to be sure
            router.refresh();
        } catch (err) {
            alert('Failed to delete workshop');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (workshop: Workshop, field: 'isactive' | 'published' | 'isregistrationopen') => {
        const newValue = workshop[field] === 1 ? 0 : 1;
        const updatedWorkshop = { ...workshop, [field]: newValue };

        // Optimistic update
        setWorkshops(prev => prev.map(c => ((c.id || c.post_id) === (workshop.id || workshop.post_id) ? updatedWorkshop : c)));

        try {
            await saveItem(updatedWorkshop);
            router.refresh();
        } catch (err) {
            console.error(err);
            setWorkshops(prev => prev.map(c => ((c.id || c.post_id) === (workshop.id || workshop.post_id) ? workshop : c)));
            alert(`Failed to update ${field}`);
        }
    };

    const openModal = (workshop?: Workshop) => {
        setEditingWorkshop(workshop || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingWorkshop(null);
    };

    const fetchWorkshops = async () => {
        setLoading(true);
        try {
            const data = await getItemsByType('workshop');
            // Ensure data is array and sort by createddate desc
            const sortedData = Array.isArray(data) ? data.sort((a: any, b: any) =>
                new Date(b.createddate || 0).getTime() - new Date(a.createddate || 0).getTime()
            ) : [];
            setWorkshops(sortedData);
        } catch (err) {
            console.error("Failed to fetch workshops", err);
            setWorkshops([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const handleFormSuccess = async () => {
        closeModal();
        await fetchWorkshops();
        router.refresh();
    };

    // Filter workshops based on search term
    const filteredWorkshops = workshops.filter(workshop =>
        workshop.posttitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (workshop.postcategory && workshop.postcategory.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            {/* Header / Add Button / Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 mb-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-800">All Workshops</h2>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {filteredWorkshops.length}
                    </span>
                </div>

                <div className="flex flex-1 max-w-md w-full gap-2">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search workshops by title or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        />
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                    >
                        <span>+ Add New Workshop</span>
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
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Workshop Info
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Published
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Registration
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredWorkshops.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No workshops found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredWorkshops.map((workshop) => (
                                    <tr key={workshop.id || workshop.post_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-12 w-16 bg-gray-100 rounded-md overflow-hidden relative">
                                                {workshop.post_image ? (
                                                    <img
                                                        src={workshop.post_image}
                                                        alt={workshop.posttitle}
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
                                            <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-xs" title={workshop.posttitle}>
                                                {workshop.posttitle}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500">
                                                {workshop.createddate ? new Date(workshop.createddate).toLocaleDateString() : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-xs">
                                                {workshop.price && (
                                                    <span className="font-semibold text-gray-900">₹{workshop.price}</span>
                                                )}
                                                {workshop.coursedate && (
                                                    <span className="text-gray-600">📅 {new Date(workshop.coursedate).toLocaleDateString()}</span>
                                                )}
                                                {workshop.coursetime && (
                                                    <span className="text-gray-600">⏰ {workshop.coursetime}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {workshop.type ? (workshop.type.charAt(0).toUpperCase() + workshop.type.slice(1)) : 'Workshop'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggle(workshop, 'isactive')}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${workshop.isactive === 1
                                                    ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                                                    }`}
                                            >
                                                {workshop.isactive === 1 ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggle(workshop, 'published')}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${workshop.published === 1
                                                    ? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
                                                    : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {workshop.published === 1 ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggle(workshop, 'isregistrationopen')}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${workshop.isregistrationopen === 1
                                                    ? 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200'
                                                    : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {workshop.isregistrationopen === 1 ? 'Open' : 'Closed'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(workshop)}
                                                    className="text-primary hover:text-primary/80 p-1 hover:bg-primary/5 rounded-full transition-colors"
                                                    title="Edit"
                                                >
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(workshop.id)}
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
                            {/* Reusing CourseForm */}
                            <CourseForm
                                initialData={{ ...editingWorkshop, type: editingWorkshop?.type || 'workshop' }}
                                isEditMode={!!editingWorkshop}
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
