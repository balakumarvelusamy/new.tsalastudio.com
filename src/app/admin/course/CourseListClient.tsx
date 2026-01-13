'use client';

import React, { useState, useEffect } from 'react';


import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PencilSquareIcon, TrashIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { deleteItem, saveItem, getItemsByType } from '../../../services/api';
import CourseForm from './CourseForm';

interface Course {
    id: string; // Primary Key
    post_id?: string; // Legacy/Secondary Key
    posttitle: string;
    post_image: string;
    isactive: number;
    published: number;
    slug?: string;
    [key: string]: any;
}

export default function CourseListClient({ initialCourses }: { initialCourses: any[] }) {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;

        setLoading(true);
        try {
            await deleteItem(id);
            // setCourses(prev => prev.filter(c => (c.id || c.post_id) !== id)); // Optimistic local remove
            fetchCourses(); // Fetch fresh list to be sure
            router.refresh();
        } catch (err) {
            alert('Failed to delete course');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (course: Course, field: 'isactive' | 'published') => {
        const newValue = course[field] === 1 ? 0 : 1;
        const updatedCourse = { ...course, [field]: newValue };

        // Optimistic update
        setCourses(prev => prev.map(c => ((c.id || c.post_id) === (course.id || course.post_id) ? updatedCourse : c)));

        try {
            await saveItem(updatedCourse);
            router.refresh();
        } catch (err) {
            console.error(err);
            setCourses(prev => prev.map(c => ((c.id || c.post_id) === (course.id || course.post_id) ? course : c)));
            alert(`Failed to update ${field}`);
        }
    };

    const openModal = (course?: Course) => {
        setEditingCourse(course || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
    };

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const data = await getItemsByType('course');
            // Ensure data is array
            setCourses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch courses", err);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleFormSuccess = async () => {
        closeModal();
        await fetchCourses();
        router.refresh();
    };

    return (
        <div>
            {/* Header / Add Button */}
            <div className="flex justify-end p-4">
                <button
                    onClick={() => openModal()}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm text-sm font-medium flex items-center gap-2"
                >
                    + Add New Course
                </button>
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
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Published
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No courses found.
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.id || course.post_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-12 w-16 bg-gray-100 rounded-md overflow-hidden relative">
                                                {course.post_image ? (
                                                    <img
                                                        src={course.post_image}
                                                        alt={course.posttitle}
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
                                            <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-xs" title={course.posttitle}>
                                                {course.posttitle}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggle(course, 'isactive')}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${course.isactive === 1
                                                    ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                                                    }`}
                                            >
                                                {course.isactive === 1 ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggle(course, 'published')}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${course.published === 1
                                                    ? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
                                                    : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {course.published === 1 ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(course)}
                                                    className="text-primary hover:text-primary/80 p-1 hover:bg-primary/5 rounded-full transition-colors"
                                                    title="Edit"
                                                >
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course.id)}
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
                            {/* Reusing CourseForm, adding padding wrapper if needed, but Form has its own padding/style */}
                            <CourseForm
                                initialData={editingCourse || undefined}
                                isEditMode={!!editingCourse}
                                onSuccess={handleFormSuccess}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
