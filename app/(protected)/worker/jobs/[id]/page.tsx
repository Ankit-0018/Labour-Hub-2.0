"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import { WorkerHeader } from "@/components/worker/worker-header";
import {
    Briefcase,
    MapPin,
    Clock,
    IndianRupee,
    ChevronLeft,
    Star,
    CheckCircle2,
    Calendar
} from "lucide-react";
import Image from "next/image";
import "@/styles/worker.css";

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    // Dummy job data
    const job = {
        id,
        title: "Skilled Mason / मेशन",
        description: "We are looking for an experienced mason for a 2-day construction project in Sector 62. Must have your own tools and at least 3 years of experience. Work includes bricklaying and cement plastering.",
        skillsRequired: ["Mason", "Plastering", "Bricklaying"],
        wage: 800,
        duration: "8hours",
        location: "Sector 62, Noida",
        employerName: "ABC Constructions",
        employerRating: 4.8,
        postedAt: "2 hours ago",
        distance: "1.5 km away",
    };

    const handleApply = () => {
        // In a real app, this would call an API
        alert("Applied successfully! / सफलतापूर्वक आवेदन किया गया!");
    };

    return (
        <div className="worker-container">
            <div className="worker-layout">
                <WorkerHeader title="Job Details" />

                {/* Back Button */}
                <div className="px-4 py-3">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        वापस / Back
                    </button>
                </div>

                <div className="px-4 space-y-6 pb-32">
                    {/* Job Image & Basic Info */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                        <div className="relative h-48 w-full bg-gray-100">
                            {/* Placeholder for the generated image */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <Briefcase className="w-12 h-12 opacity-20" />
                            </div>
                            {/* Once image is available, we can use it here */}
                            <Image
                                src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=1000"
                                alt="Job image"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                ₹{job.wage} / {job.duration}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-medium">
                                    Open
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                                <div className="flex items-center">
                                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                                    {job.location}
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                                    {job.distance}
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                                    {job.postedAt}
                                </div>
                            </div>

                            <div className="flex items-center pt-4 border-t border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 mr-3 flex items-center justify-center font-bold text-gray-600">
                                    {job.employerName.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">{job.employerName}</p>
                                    <div className="flex items-center text-xs text-yellow-500">
                                        <Star className="w-3 h-3 fill-current mr-1" />
                                        {job.employerRating} Employer Rating
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-blue-600"
                                    onClick={() => router.push(`/worker/employer/${id}`)}
                                >
                                    View Profile
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                            विवरण / Description
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {job.description}
                        </p>
                    </div>

                    {/* Skills Required */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                            आवश्यक कौशल / Skills Required
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {job.skillsRequired.map((skill) => (
                                <span
                                    key={skill}
                                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="fixed bottom-24 left-0 right-0 px-4 max-w-[28rem] mx-auto z-40">
                        <Button
                            onClick={handleApply}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-2xl shadow-xl flex items-center justify-center gap-2 group"
                        >
                            <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-lg font-bold">अभी आवेदन करें / Apply Now</span>
                        </Button>
                    </div>
                </div>
            </div>
            <WorkerNav />
        </div>
    );
}
