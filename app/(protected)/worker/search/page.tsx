"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import "@/styles/worker.css";
import { Search as SearchIcon, Filter } from "lucide-react";
import { Job } from "@/lib/types";
import { getOpenJobs } from "@/lib/services/worker";
import { useUserStore } from "@/lib/stores/useUserStore";

export default function WorkerSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[] | undefined>();
  const router = useRouter();
  const { user } = useUserStore();
  const filters = [
    { label: "सब / All", value: "all" },
    { label: "तुरंत / Urgent", value: "urgent" },
    { label: "अधिक पे / High Pay", value: "highpay" },
    { label: "निकट / Nearest", value: "nearest" },
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await getOpenJobs();
      setJobs(res as Job[]);
    };
    fetchJobs();
  }, []);

  const filteredJobs =
    jobs?.filter((job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  const handleViewJob = (jobId: string) => {
    // Navigate to job details page
    router.push(`/worker/jobs/${jobId}`);
  };

  const handleViewEmployer = (employer: any) => {
    // Navigate to employer profile page
    const employerId = typeof employer === "string" ? employer : employer?.id;
    if (employerId) {
      router.push(`/worker/employer/${employerId}`);
    }
  };

  return (
    <div className="worker-container">
      <div className="worker-layout">
        {/* Header */}
        <div className="worker-header">
          <div className="worker-header-content">
            <h1 className="worker-header-title">पास में काम / Jobs</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 bg-card border-b border-border sticky top-14 z-30">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <SearchIcon className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-section">
          <div className="filter-tabs">
            {filters?.map((filter) => (
              <button
                key={filter.value}
                onClick={() =>
                  setSelectedSkill(
                    selectedSkill === filter.value ? null : filter.value,
                  )
                }
                className={`filter-tab ${selectedSkill === filter.value ? "active" : ""}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <div className="px-4 py-6 space-y-4">
          {filteredJobs.length > 0 ? (
            <>
              <p className="text-sm text-gray-600">
                {filteredJobs.length} मिला / Found {filteredJobs.length} nearby
                jobs
              </p>
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {job.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {typeof job.employerId === "string"
                          ? job.employerId
                          : job.employerId?.id || "Unknown"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ₹{job.wage}
                      </p>
                      <p className="text-xs text-gray-600">{job.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                        {job?.skillsRequired?.map((s) => (
                          <p key={s}>{s}</p>
                        ))}
                      </span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {job.id} km
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
                        onClick={() =>
                          handleViewEmployer(job.employerId)
                        }
                      >
                        View Employer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">कोई काम नहीं मिला</h3>
              <p className="empty-state-description">
                अपनी खोज या फिल्टर को समायोजित करने का प्रयास करें
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <WorkerNav />
    </div>
  );
}

function Loading() {
  return null;
}

export { Loading };
