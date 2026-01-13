'use client';

import React, { useState, useEffect } from 'react';
import { saveItem, getSecrets } from '../../../services/api';
import { uploadToS3 } from '../s3Utils';
import legacyCourses from '../../../data/courses.json';
import legacyProducts from '../../../data/products.json';
import { useRouter } from 'next/navigation';

export default function MigratePage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [isMigrating, setIsMigrating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [secret, setSecret] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        getSecrets().then(setSecret).catch(err => addLog(`Failed to load secrets: ${err.message}`));
    }, []);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    };

    const fetchImage = async (url: string): Promise<Blob | null> => {
        try {
            // Use proxy to avoid CORS
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
            const res = await fetch(proxyUrl);

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }
            return await res.blob();
        } catch (err: any) {
            addLog(`Error fetching image: ${err.message}`);
            return null;
        }
    };

    const handleMigration = async () => {
        if (!secret) {
            alert("AWS Secrets not loaded yet.");
            return;
        }

        if (!confirm("Are you sure you want to start the migration? This will upload images to S3 and save data to the DB.")) {
            return;
        }

        setIsMigrating(true);
        setLogs([]);
        setProgress(0);

        try {
            const total = legacyProducts.length;
            let successCount = 0;

            for (let i = 0; i < total; i++) {
                const item = legacyProducts[i];
                const title = item.p_name || 'Untitled Product';
                addLog(`Processing ${i + 1}/${total}: ${title}`);

                let imageUrl = item.p_image || '';

                // Ensure ID
                const id = item.id || crypto.randomUUID();

                // 1. Handle Image Migration
                if (imageUrl && imageUrl.includes('firebasestorage')) {
                    addLog(`  > Downloading image...`);
                    const blob = await fetchImage(imageUrl);

                    if (blob) {
                        const ext = blob.type.split('/')[1] || 'jpg';
                        // Use id + slug-like title for filename
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        const baseName = `${id}-${slug}`;
                        const filename = `${baseName}.${ext}`;

                        addLog(`  > Uploading to S3 as ${filename}...`);
                        try {
                            const newUrl = await uploadToS3(blob, filename, secret, 'products');
                            imageUrl = newUrl;
                            addLog(`  > Upload success: ${newUrl}`);
                        } catch (s3Err: any) {
                            addLog(`  > S3 Upload Failed: ${s3Err.message}`);
                        }
                    } else {
                        addLog(`  > Failed to download image.`);
                    }
                } else {
                    addLog(`  > Skipping image (already migrated or missing).`);
                }

                // 2. Prepare Data
                // Construct payload matching Product structure
                const payload = {
                    ...item,
                    id: id,
                    posttitle: title, // Map p_name to posttitle for consistency or keep p_name? Sticking to raw item + id + type override
                    p_image: imageUrl,
                    type: 'product', // Enforce type
                    createdby: item.createdby || 'MigrationTool',
                    updateddate: new Date().toISOString(),
                    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                };

                // 3. Save to DB
                addLog(`  > Saving to database...`);
                try {
                    await saveItem(payload);
                    successCount++;
                    addLog(`  > Saved successfully.`);
                } catch (dbErr: any) {
                    addLog(`  > DB Save Failed: ${dbErr.message}`);
                }

                // Update Progress
                setProgress(Math.round(((i + 1) / total) * 100));

                // Small delay to be gentle
                await new Promise(r => setTimeout(r, 500));

                // TESTING: Stop after 1 item
                //addLog("Testing Mode: Stopping after first item.");
                //break;
            }

            addLog(`Migration Complete! Successfully migrated ${successCount}/${total} items.`);

        } catch (err: any) {
            addLog(`Critical Error: ${err.message}`);
        } finally {
            setIsMigrating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Data Migration Tool</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Legacy Product Migration</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Found <strong>{legacyProducts.length}</strong> items in <code>src/data/products.json</code>.
                    </p>
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        onClick={handleMigration}
                        disabled={isMigrating || !secret}
                        className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${isMigrating || !secret
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isMigrating ? 'Migrating...' : 'Start Migration'}
                    </button>

                    {isMigrating && (
                        <div className="flex-1 max-w-xs">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="text-xs text-gray-500 mt-1 text-center">{progress}%</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-xl shadow-inner h-96 overflow-y-auto">
                {logs.length === 0 ? (
                    <div className="text-gray-600">Ready to start...</div>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className="mb-1 border-b border-gray-800 pb-1 last:border-0">{log}</div>
                    ))
                )}
            </div>
        </div>
    );
}
