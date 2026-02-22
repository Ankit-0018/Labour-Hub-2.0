"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Calendar, Clock, IndianRupee, Briefcase } from "lucide-react";
import Link from "next/link";
import { getJobByIdAction, applyToJobAction } from "@/lib/server/actions";
import { WorkerNav } from "@/components/navigation/WorkerNav";

export default function JobDetailPage() {
    const router = useRouter();
    const { id } = useParams();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const [jobData, apps] = await Promise.all([
                    getJobByIdAction(id as string),
                    import("@/lib/server/actions").then(m => m.getWorkerApplicationsAction())
                ]);

                setJob(jobData);
                const alreadyApplied = apps?.some((app: any) => app.jobId === id);
                setHasApplied(!!alreadyApplied);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobData();
    }, [id]);

    const handleApply = async () => {
        setApplying(true);
        try {
            const res = await applyToJobAction(id as string);
            if (res.success) {
                setHasApplied(true);
                alert("आवेदन सफल! / Application successful!");
                // router.push("/worker/search"); // Keep user on page to see the updated status
            }
        } catch (err: any) {
            alert(err.message || "Error applying for job");
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <p className="text-gray-600 mb-4">Job not found.</p>
                <Link href="/worker/search">
                    <Button>Go Back</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center gap-4 sticky top-0 z-40">
                <Link href="/worker/search">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold">काम का विवरण / Job Details</h1>
            </div>

            {/* Image */}
            <div className="w-full h-64 bg-gray-200 relative mb-6">
                <img
                    src={job.photoUrl}
                    alt={job.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h2 className="text-2xl font-bold mb-1">{job.title}</h2>
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-600/80 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider">
                            {job.skill}
                        </span>
                        {job.status === 'open' && (
                            <span className="bg-green-500/80 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider">
                                Active
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-6">
                {/* Main Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                <IndianRupee className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-tight">Wage / मजदूरी</p>
                                <p className="font-bold text-lg">₹{job.wage}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-tight">Duration / अवधि</p>
                                <p className="font-bold text-lg">{job.duration}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location & Time */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="mt-1 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-tight font-semibold">Location / स्थान</p>
                            <p className="text-sm text-gray-900 font-medium">
                                {typeof job.location === 'string' ? job.location : (job.location?.address || 'Gurgaon, Haryana')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 border-t pt-4">
                        <div className="mt-1 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-tight font-semibold">Posted Date / तारीख</p>
                            <p className="text-sm text-gray-900 font-medium">{new Date(job.createdAt).toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-900">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        विवरण / Description
                    </h3>
                    <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-100/50">
                        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                            {job.description || "No specific description provided by the employer."}
                        </p>
                    </div>
                </div>

                {/* Skills Required */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-3">आवश्यक कौशल / Related Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {job.skillsRequired && job.skillsRequired.length > 0 ? (
                            job.skillsRequired.map((s: string) => (
                                <span key={s} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                    {s}
                                </span>
                            ))
                        ) : (
                            <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs">General Work</span>
                        )}
                    </div>
                </div>

                {/* Apply Button */}
                <div className="p-4 bg-white border-t border-gray-100 mt-8 rounded-2xl shadow-sm">
                    <Button
                        className={`w-full h-14 text-lg font-bold shadow-lg transition-all ${hasApplied ? "bg-gray-100 text-gray-500 border-gray-200" : "bg-blue-600 text-white"
                            }`}
                        disabled={applying || job.status !== 'open' || hasApplied}
                        onClick={handleApply}
                    >
                        {applying ? "आवेदन हो रहा है..." :
                            hasApplied ? "पहले ही आवेदन कर दिया / Already Applied" :
                                (job.status === 'open' ? "अभी आवेदन करें / Apply Now" : "काम उपलब्ध नहीं है")}
                    </Button>
                </div>
            </div>

            <WorkerNav />
        </div>
    );
}
