'use client';
import React, { useState } from 'react';
import usersDataRaw from '../../../data/gallery.json';
import newsletterDataRaw from '../../../data/gallery.json';
import { saveItem } from '../../../services/api';

const usersData = usersDataRaw as any[];
const newsletterData = newsletterDataRaw as any[];

export default function MigrateUsersPage() {
    const [status, setStatus] = useState('');
    const [migratedCount, setMigratedCount] = useState(0);

    // --- User Migration Logic ---
    const migrateOneUser = async () => {
        setStatus('Migrating 1 user...');
        try {
            const user = usersData[0]; // Take the first user
            const newUser = {
                ...user,
                id: user.userid,
                type: 'user'
            }
            // @ts-ignore
            delete newUser.userid;

            console.log("Migrating:", newUser);
            await saveItem(newUser);

            setStatus('Successfully migrated 1 user! Check console for details.');
            setMigratedCount(1);
        } catch (error) {
            console.error(error);
            setStatus('Error migrating user. Check console.');
        }
    };

    const migrateAllUsers = async () => {
        if (!confirm(`Are you sure you want to migrate all ${usersData.length} users?`)) return;

        setStatus('Starting full user migration...');
        setMigratedCount(0);
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < usersData.length; i++) {
            const user = usersData[i];
            try {
                setStatus(`Migrating User ${i + 1}/${usersData.length}: ${user.name}`);

                const newUser = {
                    ...user,
                    id: user.userid,
                    type: 'user'
                };
                // @ts-ignore
                delete newUser.userid;

                await saveItem(newUser);
                successCount++;
                setMigratedCount(successCount);
            } catch (error) {
                console.error(`Error migrating user ${user.email}:`, error);
                errorCount++;
            }
            // Small delay to be nice to the API
            await new Promise(r => setTimeout(r, 100));
        }

        setStatus(`User Migration Complete! Success: ${successCount}, Errors: ${errorCount}`);
    };

    // --- Newsletter Migration Logic ---
    const migrateOneNewsletter = async () => {
        setStatus('Migrating 1 newsletter subscriber...');
        try {
            const item = newsletterData[0];
            const newItem = {
                ...item,
                id: crypto.randomUUID(),
                type: 'newsletter',
                isactive: 1
            };

            console.log("Migrating Newsletter:", newItem);
            await saveItem(newItem);

            setStatus('Successfully migrated 1 newsletter subscriber!');
        } catch (error) {
            console.error(error);
            setStatus('Error migrating newsletter. Check console.');
        }
    };

    const migrateAllNewsletter = async () => {
        if (!confirm(`Are you sure you want to migrate all ${newsletterData.length} newsletter subscribers?`)) return;

        setStatus('Starting full newsletter migration...');
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < newsletterData.length; i++) {
            const item = newsletterData[i];
            try {
                setStatus(`Migrating Newsletter ${i + 1}/${newsletterData.length}: ${item.email}`);

                const newItem = {
                    ...item,
                    id: crypto.randomUUID(),
                    type: 'newsletter',
                    isactive: 1
                };

                await saveItem(newItem);
                successCount++;
            } catch (error) {
                console.error(`Error migrating newsletter ${item.email}:`, error);
                errorCount++;
            }
            // Small delay
            await new Promise(r => setTimeout(r, 100));
        }

        setStatus(`Newsletter Migration Complete! Success: ${successCount}, Errors: ${errorCount}`);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Data Migration</h1>

            {status && (
                <div className="mb-6 p-4 bg-gray-100 border border-blue-200 rounded-lg sticky top-4 z-10 shadow-sm">
                    <strong>Status:</strong> {status}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Users Section */}
                <div className="bg-white p-6 rounded shadow border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Users Migration</h2>
                    <p className="mb-4">Total Users: <strong>{usersData.length}</strong></p>

                    <div className="space-y-3">
                        <button
                            onClick={migrateOneUser}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                        >
                            Test Migrate 1 User
                        </button>

                        <button
                            onClick={migrateAllUsers}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                        >
                            Migrate ALL {usersData.length} Users
                        </button>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="bg-white p-6 rounded shadow border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Newsletter Migration</h2>
                    <p className="mb-4">Total Subscribers: <strong>{newsletterData.length}</strong></p>

                    <div className="space-y-3">
                        <button
                            onClick={migrateOneNewsletter}
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
                        >
                            Test Migrate 1 Subscriber
                        </button>

                        <button
                            onClick={migrateAllNewsletter}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full"
                        >
                            Migrate ALL {newsletterData.length} Subscribers
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
