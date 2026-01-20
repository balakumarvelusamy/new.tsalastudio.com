'use client';
import React, { useState, useEffect } from 'react';
import { getItemsByType } from '../../../services/api';
import config from '../../../config.json';
import dynamic from 'next/dynamic';
import { ClipboardDocumentIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

// Dynamic import for Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function NewsletterPage() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // Email Composition State
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        setLoading(true);
        const data = await getItemsByType('newsletter');
        setSubscribers(data || []);
        setLoading(false);
    };

    const [searchTerm, setSearchTerm] = useState('');

    const activeSubscribers = subscribers.filter(s => String(s.isactive) === '1' || s.isactive === 1);
    const inactiveSubscribers = subscribers.filter(s => String(s.isactive) !== '1' && s.isactive !== 1);

    const filteredActive = activeSubscribers.filter(s => s.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredInactive = inactiveSubscribers.filter(s => s.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCopyEmails = () => {
        const emails = activeSubscribers.map(s => s.email).join(',');
        navigator.clipboard.writeText(emails);
        alert('Active subscriber emails copied to clipboard!');
    };

    const handleSendBulkEmail = async () => {
        if (!subject || !body) {
            alert('Please enter both subject and body');
            return;
        }

        if (!confirm(`Are you sure you want to send this email to ${activeSubscribers.length} active subscribers?`)) {
            return;
        }

        if (activeSubscribers.length === 0) {
            alert('No active subscribers to send to.');
            return;
        }

        if (!confirm(`Using service: ${config.email_service_url}\n\nAre you sure you want to send this email to ${activeSubscribers.length} ACTIVE subscribers?`)) {
            return;
        }

        setSending(true);
        setStatusMsg(null);
        let successCount = 0;
        let failCount = 0;

        try {
            // Iterate and send individually to protect privacy - ONLY to active subscribers
            for (const sub of activeSubscribers) {
                const emailBody = body.replace('{{name}}', sub.name || 'Subscriber');

                // Using user provided structure
                const payload = {
                    from: config.fromemail,
                    to: sub.email, // Send individually
                    subject: subject,
                    text: "", // Html only as per request
                    html: emailBody
                };

                const res = await fetch(config.email_service_url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) successCount++;
                else failCount++;
            }

            setStatusMsg({
                type: 'success',
                text: `Process Completed. Sent: ${successCount}, Failed: ${failCount}`
            });

            // Clear form if mostly successful
            if (successCount > 0) {
                setSubject('');
                setBody('');
            }

        } catch (error: any) {
            console.error("Bulk send error:", error);
            setStatusMsg({ type: 'error', text: 'Critical error during sending: ' + error.message });
        } finally {
            setSending(false);
        }
    };

    const SubscriberTable = ({ data, title, isActiveList }: { data: any[], title: string, isActiveList: boolean }) => (
        <div className="mb-6">
            <h3 className={`text-md font-semibold mb-2 ${isActiveList ? 'text-green-600' : 'text-gray-500'}`}>
                {title} ({data.length})
            </h3>
            {data.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No {searchTerm ? 'matching' : ''} {isActiveList ? 'active' : 'inactive'} subscribers.</p>
            ) : (
                <div className="overflow-auto max-h-60 border rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-3">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((sub) => (
                                <tr key={sub.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900 border-l-4 border-transparent">
                                        {sub.email}
                                        {!isActiveList && <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">Unsubscribed</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const [testEmails, setTestEmails] = useState('');
    const [sendingTest, setSendingTest] = useState(false);

    const handleSendTestEmail = async () => {
        if (!subject || !body) {
            alert('Please enter both subject and body');
            return;
        }

        if (!testEmails) {
            alert('Please enter at least one test email address');
            return;
        }

        const recipients = testEmails.split(',').map(e => e.trim()).filter(e => e);
        if (recipients.length === 0) {
            alert('Invalid email format');
            return;
        }

        setSendingTest(true);
        setStatusMsg(null);
        let successCount = 0;
        let failCount = 0;

        try {
            for (const email of recipients) {
                const emailBody = body.replace('{{name}}', 'Test User');

                const payload = {
                    from: config.fromemail,
                    to: email,
                    subject: `[TEST] ${subject}`,
                    text: "",
                    html: emailBody
                };

                const res = await fetch(config.email_service_url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) successCount++;
                else failCount++;
            }

            setStatusMsg({
                type: successCount > 0 ? 'success' : 'error',
                text: `Test Send Complete. Sent: ${successCount}, Failed: ${failCount}`
            });

        } catch (error: any) {
            console.error("Test send error:", error);
            setStatusMsg({ type: 'error', text: 'Critical error during test send: ' + error.message });
        } finally {
            setSendingTest(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold font-heading mb-6 text-gray-800">Newsletter Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left: Subscribers List */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[calc(100vh-150px)] flex flex-col">
                    <div className="flex flex-col gap-4 mb-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Subscribers List</h2>
                            <button
                                onClick={handleCopyEmails}
                                className="btn btn-sm btn-outline flex items-center gap-2 text-sm"
                                title="Copy ACTIVE emails to clipboard"
                            >
                                <ClipboardDocumentIcon className="w-4 h-4" /> Copy Active Emails
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Search emails..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none text-sm"
                        />
                    </div>

                    <div className="flex-1 overflow-auto pr-2">
                        {loading ? (
                            <p className="text-gray-500 text-center py-10">Loading...</p>
                        ) : (
                            <>
                                <SubscriberTable data={filteredActive} title="Active Subscribers" isActiveList={true} />
                                <SubscriberTable data={filteredInactive} title="Unsubscribed Users" isActiveList={false} />
                            </>
                        )}
                    </div>
                </div>

                {/* Right: Compose Email */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-150px)] overflow-hidden">
                    <h2 className="text-lg font-semibold mb-4">Compose Bulk Email</h2>

                    {statusMsg && (
                        <div className={`mb-4 p-3 rounded text-sm ${statusMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {statusMsg.text}
                        </div>
                    )}

                    <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                                placeholder="Newsletter Subject"
                            />
                        </div>

                        <div className="flex-1 flex flex-col min-h-0">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
                            <div className="flex-1 overflow-hidden flex flex-col">
                                <ReactQuill
                                    theme="snow"
                                    value={body}
                                    onChange={setBody}
                                    className="h-full flex flex-col [&_.ql-container]:flex-1 [&_.ql-container]:overflow-auto"
                                    placeholder="Write your newsletter content here..."
                                />
                            </div>
                        </div>

                        <div className="mt-auto pt-4 space-y-4 border-t border-gray-100">
                            {/* Test Email Section */}
                            <div className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg">
                                <input
                                    type="text"
                                    value={testEmails}
                                    onChange={(e) => setTestEmails(e.target.value)}
                                    placeholder="Test emails (comma separated)"
                                    className="flex-1 px-3 py-2 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-secondary outline-none"
                                />
                                <button
                                    onClick={handleSendTestEmail}
                                    disabled={sendingTest || !testEmails}
                                    className="btn btn-sm btn-outline whitespace-nowrap"
                                >
                                    {sendingTest ? 'Sending...' : 'Send Test'}
                                </button>
                            </div>

                            <div>
                                <button
                                    onClick={handleSendBulkEmail}
                                    disabled={sending || activeSubscribers.length === 0}
                                    className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
                                >
                                    {sending ? 'Sending...' : <><PaperAirplaneIcon className="w-5 h-5" /> Send to {activeSubscribers.length} Active Subscribers</>}
                                </button>
                                <p className="text-xs text-gray-500 text-center mt-2">
                                    Emails will be sent individually to each ACTIVE subscriber via {config.email_service_url}.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
