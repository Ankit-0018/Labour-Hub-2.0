"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WorkerNav } from '@/components/navigation/WorkerNav';
import '@/styles/worker.css';
import { Search as SearchIcon, Filter } from 'lucide-react';
import Link from 'next/link';
import { getOpenJobsAction, applyToJobAction } from '@/lib/server/actions';

export default function WorkerSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const filters = [
    { label: "सब / All", value: "all" },
    { label: "तुरंत / Urgent", value: "urgent" },
    { label: "अधिक पे / High Pay", value: "highpay" },
    { label: "निकट / Nearest", value: "nearest" },
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      const jobList = await getOpenJobsAction();
      setJobs(jobList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleApply = async (jobId: string) => {
    try {
      const res = await applyToJobAction(jobId);
      if (res.success) {
        alert("आवेदन सफल / Application successful!");
        fetchJobs(); // Refresh list (though maybe we should hide applied jobs)
      }
    } catch (err) {
      console.error(err);
      alert("आवेदन विफल: " + (err instanceof Error ? err.message : "Error"));
    }
  };

  const filteredJobs = jobs?.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

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
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedSkill(selectedSkill === filter.value ? null : filter.value)}
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
                {filteredJobs.length} मिला / Found{" "}
                {filteredJobs.length} nearby jobs
              </p>
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden"
                >
                  <Link href={`/worker/job/${job.id}`} className="block p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {job.title}
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                          Looking for {job.skillsRequired[0] || 'Worker'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          ₹{job.wage}
                        </p>
                        <p className="text-[10px] text-gray-500">{job.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                        <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded font-medium">
                          {job.skillsRequired[0] || 'General'}
                        </span>
                        <span className="bg-gray-50 text-gray-600 text-[10px] px-2 py-0.5 rounded">
                          Nearby
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="text-xs h-7 bg-blue-600 hover:bg-blue-700 px-4"
                      >
                        विवरण / View Details
                      </Button>
                    </div>
                  </Link>
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
