'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EmployerNav } from '@/components/navigation/EmployerNav';
import { getEmployerApplicationsAction, hireWorkerAction, rejectApplicationAction } from '@/lib/server/actions';
import { ChevronLeft, User, Star, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function EmployerApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    async function fetchApplications() {
        try {
            setLoading(true);
            const data = await getEmployerApplicationsAction();
            setApplications(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleHire = async (app: any) => {
        try {
            const confirmed = confirm(`Are you sure you want to hire ${app.workerName} for "${app.jobTitle}"?`);
            if (!confirmed) return;

            const res = await hireWorkerAction(app);
            if (res.success) {
                alert("नियुक्ति सफल! / Hiring successful!");
                fetchApplications();
            }
        } catch (err) {
            console.error(err);
            alert("Hiring failed");
        }
    };

    const handleReject = async (applicationId: string) => {
        try {
            const confirmed = confirm("Are you sure you want to reject this application?");
            if (!confirmed) return;

            const res = await rejectApplicationAction(applicationId);
            if (res.success) {
                alert("आवेदन अस्वीकृत / Application rejected");
                fetchApplications();
            }
        } catch (err) {
            console.error(err);
            alert("Error rejecting application");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-blue-600 text-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
                    <Link href="/employer/home">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-xl font-bold">आवेदन / Applications</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading...</div>
                ) : applications.length > 0 ? (
                    applications.map((app) => (
                        <div key={app.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{app.jobTitle}</h3>
                                    <p className="text-sm text-gray-600">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600 text-lg">₹{app.wage}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-3 mb-4">
                                <Link href={`/employer/worker/${app.workerId}`} className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl hover:bg-blue-200 transition-colors">
                                    👨‍🔧
                                </Link>
                                <div className="flex-1">
                                    <Link href={`/employer/worker/${app.workerId}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                        {app.workerName}
                                    </Link>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>{app.workerSkill}</span>
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            {app.workerRating}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 text-sm border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => handleReject(app.id)}
                                >
                                    अस्वीकार / Reject
                                </Button>
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleHire(app)}
                                >
                                    हायर करें / Hire
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="text-4xl mb-4 text-gray-300">📋</div>
                        <h3 className="text-lg font-medium text-gray-900">कोई आवेदन नहीं मिला</h3>
                        <p className="text-gray-500">No applications found</p>
                    </div>
                )}
            </div>

            <EmployerNav />
        </div>
    );
}
