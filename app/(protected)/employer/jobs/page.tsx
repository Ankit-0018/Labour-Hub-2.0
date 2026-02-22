"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Clock, MapPin, IndianRupee, Briefcase, CheckCircle2, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import { getEmployerActiveJobsAction, getEmployerCompletedJobsAction, completeJobAction } from "@/lib/server/actions";

export default function EmployerJobsPage() {
    const [activeJobs, setActiveJobs] = useState<any[]>([]);
    const [completedJobs, setCompletedJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"active" | "completed">("active");
    const [completingId, setCompletingId] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [active, completed] = await Promise.all([
                getEmployerActiveJobsAction(),
                getEmployerCompletedJobsAction()
            ]);
            setActiveJobs(active);
            setCompletedJobs(completed);
        } catch (err) {
            console.error("Error fetching jobs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleComplete = async (jobId: string) => {
        if (!confirm("क्या आप इस काम को पूरा चिन्हित करना चाहते हैं? / Do you want to mark this job as completed?")) return;

        setCompletingId(jobId);
        try {
            const res = await completeJobAction(jobId);
            if (res.success) {
                alert("काम पूरा हुआ! / Job completed!");
                fetchData();
            }
        } catch (err) {
            console.error(err);
            alert("Error completing job");
        } finally {
            setCompletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 to-white pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-blue-600 text-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/employer/home">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">मेरे काम / My Jobs</h1>
                        <p className="text-xs text-blue-100 italic">Manage your active and past jobs</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-t border-blue-500/30">
                    <button
                        onClick={() => setTab("active")}
                        className={`flex-1 py-3 text-sm font-bold transition-all ${tab === "active" ? "bg-white text-blue-600 rounded-t-xl mx-1 mt-1 shadow-xs" : "text-blue-100"}`}
                    >
                        सक्रिय / Active ({activeJobs.length})
                    </button>
                    <button
                        onClick={() => setTab("completed")}
                        className={`flex-1 py-3 text-sm font-bold transition-all ${tab === "completed" ? "bg-white text-blue-600 rounded-t-xl mx-1 mt-1 shadow-xs" : "text-blue-100"}`}
                    >
                        पूरा हुआ / Completed ({completedJobs.length})
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading your jobs...</p>
                    </div>
                ) : (tab === "active" ? (
                    <div className="space-y-4">
                        {activeJobs.length === 0 ? (
                            <div className="bg-white rounded-2xl p-10 border border-dashed border-gray-300 text-center">
                                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 mb-1">कोई सक्रिय काम नहीं</h3>
                                <p className="text-sm text-gray-500 mb-6">अभी कोई काम सक्रिय नहीं है। नया काम पोस्ट करें!</p>
                                <Link href="/employer/post-job">
                                    <Button className="bg-blue-600 rounded-full font-bold">Post a New Job</Button>
                                </Link>
                            </div>
                        ) : (
                            activeJobs.map((job) => (
                                <div key={job.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs group hover:border-blue-200 transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${job.status === 'assigned' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                                                    {job.status === 'assigned' ? 'Assigned' : 'Open'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {new Date(job.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{job.title}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-blue-600">₹{job.wage}</p>
                                            <p className="text-[10px] text-gray-400">Total Budget</p>
                                        </div>
                                    </div>

                                    {job.assignment ? (
                                        <div className="bg-blue-50/50 rounded-xl p-3 mb-4 border border-blue-100/50 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 border border-blue-100">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">Assigned Worker</p>
                                                    <Link href={`/employer/worker/${job.assignment.workerId}`}>
                                                        <p className="text-sm font-bold text-gray-900 hover:underline">{job.assignment.workerName}</p>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link href={`/employer/worker/${job.assignment.workerId}`}>
                                                    <Button size="sm" variant="outline" className="h-8 text-[10px] bg-white">View Profile</Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 text-[10px] bg-green-500 text-white hover:bg-green-600"
                                                    onClick={() => handleComplete(job.id)}
                                                    disabled={completingId === job.id}
                                                >
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Complete
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-4 px-1">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {job.duration}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {typeof job.location === 'string' ? job.location : (job.location?.address || 'Gurgaon')}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <p className="text-[10px] text-gray-400 italic">Job ID: {job.id}</p>
                                        {!job.assignment && (
                                            <Link href="/employer/applications">
                                                <Button variant="link" className="h-auto p-0 text-blue-600 text-[11px] font-bold">Check Applications →</Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {completedJobs.length === 0 ? (
                            <div className="bg-white rounded-2xl p-10 border border-dashed border-gray-300 text-center">
                                <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 mb-1">कोई काम पूरा नहीं हुआ</h3>
                                <p className="text-sm text-gray-500">अभी तक आपके द्वारा कोई काम पूरा नहीं चिन्हित किया गया है।</p>
                            </div>
                        ) : (
                            completedJobs.map((job) => (
                                <div key={job.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs relative opacity-90 overflow-hidden grayscale-[0.3]">
                                    {/* Completed Stamp */}
                                    <div className="absolute top-2 right-2 rotate-12 opacity-20 pointer-events-none">
                                        <div className="border-2 border-green-600 text-green-600 px-3 py-1 font-black uppercase text-xs rounded">Completed</div>
                                    </div>

                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-700">{job.title}</h3>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tight">Completed At: {new Date(job.completedAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-green-600">₹{job.wage}</p>
                                            <p className="text-[10px] text-gray-400">Paid Amount</p>
                                        </div>
                                    </div>

                                    {job.assignment && (
                                        <div className="flex items-center gap-2 mt-4 text-[11px]">
                                            <span className="text-gray-500">Hired:</span>
                                            <Link href={`/employer/worker/${job.assignment.workerId}`}>
                                                <span className="font-bold text-blue-600 underline">{job.assignment.workerName}</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                ))}
            </div>

            <EmployerNav />
        </div>
    );
}
