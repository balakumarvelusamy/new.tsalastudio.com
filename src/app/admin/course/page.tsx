import React from 'react';
import Link from 'next/link';
import { getItemsByType } from '../../../services/api';
import CourseListClient from './CourseListClient';

export default async function AdminCoursesPage() {
    // Fetch courses from API
    // Note: The API returns all items of type 'course'. 
    // We pass them to the client component for rendering and interaction.
    const courses = await getItemsByType('course');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold font-heading">Manage Courses</h1>
                {/* Action button moved to Client Component */}
            </div>

            <CourseListClient initialCourses={courses} />
        </div>
    );
}
