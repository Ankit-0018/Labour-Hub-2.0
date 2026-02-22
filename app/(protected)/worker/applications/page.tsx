"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Clock, MapPin, IndianRupee } from "lucide-react";
import Link from "next/link";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import { getWorkerApplicationsAction } from "@/lib/server/actions";

export default function WorkerApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await getWorkerApplicationsAction();
                setApplications(data || []);
            } catch (err) {
                console.error("Error fetching applications:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "accepted":
                return "bg-green-100 text-green-700 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "accepted":
                return "स्वीकृत / Accepted";
            case "rejected":
                return "अस्वीकृत / Rejected";
            default:
                return "लंबित / Pending";
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 to-white pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-blue-600 text-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/worker/home">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">मेरे आवेदन / My Applications</h1>
                        <p className="text-xs text-blue-100 italic">Track your job applications here</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium">Checking your applications...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 border border-dashed border-gray-300 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            📋
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">कोई आवेदन नहीं मिला</h3>
                        <p className="text-sm text-gray-500 mb-6">आपने अभी तक किसी नौकरी के लिए आवेदन नहीं किया है।</p>
                        <Link href="/worker/search">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-700 transition">
                                काम खोजें / Find Jobs
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((app) => (
                            <div key={app.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-blue-200 transition">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition truncate pr-4">
                                            {app.jobTitle}
                                        </h3>
                                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-blue-500" />
                                                {app.jobDuration}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-red-500" />
                                                {app.jobLocation}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-green-600">₹{app.jobWage}</p>
                                        <p className="text-[10px] text-gray-400">Total Wage</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-widest ${getStatusColor(app.status)}`}>
                                            {getStatusLabel(app.status)}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        Applied: {new Date(app.createdAt).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <WorkerNav />
        </div>
    );
}
