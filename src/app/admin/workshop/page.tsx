import React from 'react';
import { getItemsByType } from '../../../services/api';
import WorkshopListClient from './WorkshopListClient';

export default async function AdminWorkshopPage() {
    const workshops = await getItemsByType('workshop');

    // Sort logic (can be identical to courses)
    const sortedWorkshops = Array.isArray(workshops) ? workshops.sort((a: any, b: any) =>
        new Date(b.createddate || 0).getTime() - new Date(a.createddate || 0).getTime()
    ) : [];

    return <WorkshopListClient initialWorkshops={sortedWorkshops} />;
}
