"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Star, MapPin, Calendar, IndianRupee, Briefcase, Phone, Mail, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import { getWorkerPublicProfileAction } from "@/lib/server/actions";

export default function WorkerViewerPage() {
    const { id } = useParams();
    const [worker, setWorker] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorker = async () => {
            try {
                const data = await getWorkerPublicProfileAction(id as string);
                setWorker(data);
            } catch (err) {
                console.error("Error fetching worker profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorker();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!worker) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4">👤</div>
                <h2 className="text-xl font-bold text-gray-900">Worker Not Found</h2>
                <p className="text-gray-500 mb-6">The worker profile you are looking for does not exist or has been removed.</p>
                <Link href="/employer/home">
                    <Button className="bg-blue-600">Back to Home</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 to-white pb-24">
            {/* Header */}
            <div className="relative h-48 bg-blue-600 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute top-4 left-4 z-10">
                    <Link href="/employer/jobs">
                        <button className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Profile Card */}
            <div className="max-w-md mx-auto px-4 -mt-16 relative z-10 pb-10">
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-100 overflow-hidden relative">
                    {/* Verification Badge */}
                    <div className="absolute top-6 right-6 flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold border border-green-200">
                        <BadgeCheck className="w-3 h-3" />
                        VERIFIED
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-100 overflow-hidden mb-4">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name}`}
                                alt={worker.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 mb-1">{worker.name}</h2>
                        <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">
                            {worker.profile?.skills?.[0] || "General Labour"}
                        </p>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-100">
                                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                                <span className="text-sm font-bold">{worker.profile?.ratingAverage || "4.8"}</span>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">({worker.profile?.ratingCount || "24"} Reviews)</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mb-1">Expected Wage</p>
                            <div className="flex items-center justify-center gap-0.5 text-green-600 font-black">
                                <IndianRupee className="w-4 h-4" />
                                <span className="text-lg">{worker.profile?.dailyWage || "500"}</span>
                                <span className="text-xs font-medium text-gray-400 ml-1">/day</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mb-1">Experience</p>
                            <div className="flex items-center justify-center gap-1 text-blue-600 font-black">
                                <Briefcase className="w-4 h-4" />
                                <span className="text-lg">3+ Years</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Location</p>
                                <p className="text-sm text-gray-900 font-medium">Sector 24, Gurgaon, Haryana</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                <Mail className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Email</p>
                                <p className="text-sm text-gray-900 font-medium">{worker.email || "Contact hidden"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                <Phone className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Phone</p>
                                <p className="text-sm text-gray-900 font-medium">{worker.phone || "Contact hidden"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Skills & Equipment</h3>
                        <div className="flex flex-wrap gap-2">
                            {(worker.profile?.skills || ["Construction", "Painter", "Plumber"]).map((skill: string) => (
                                <span key={skill} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                                    {skill}
                                </span>
                            ))}
                            <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold">Has Own Tools</span>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <Button className="flex-1 bg-blue-600 h-12 rounded-xl font-bold">Call Worker</Button>
                        <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-blue-200 text-blue-600">Download CV</Button>
                    </div>
                </div>
            </div>

            <EmployerNav />
        </div>
    );
}
