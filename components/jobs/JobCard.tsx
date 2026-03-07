"use client";

import { Button } from "@/components/ui/button";
import { Job } from "@/lib/types";
import { useRouter } from "next/navigation";

interface JobCardProps {
    job: Job;
}

export function JobCard({ job }: JobCardProps) {
    const router = useRouter();

    const handleViewJob = (jobId: string) => {
        router.push(`/worker/jobs/${jobId}`);
    };

    const handleViewEmployer = (employer: any) => {
        const employerId = typeof employer === "string" ? employer : employer?.id;
        if (employerId) {
            router.push(`/worker/employer/${employerId}`);
        }
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{job.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                        {typeof job.employerId === "string"
                            ? job.employerId
                            : job.employerId?.id || "Unknown"}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-green-600">₹{job.wage}</p>
                    <p className="text-xs text-gray-600">{job.duration}</p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {job.skillsRequired?.map((skill) => (
                        <span
                            key={skill}
                            className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded"
                        >
                            {skill}
                        </span>
                    ))}
                    {/* Default distance if not present */}
                    <span className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded">
                        Nearby
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => handleViewJob(job.id)}
                    >
                        View Job
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8"
                        onClick={() => handleViewEmployer(job.employerId)}
                    >
                        View Employer
                    </Button>
                </div>
            </div>
        </div>
    );
}
