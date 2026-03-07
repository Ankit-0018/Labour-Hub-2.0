"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import "@/styles/worker.css";
import { Search as SearchIcon, Filter } from "lucide-react";
import { Job } from "@/lib/types";
import { getOpenJobs } from "@/lib/queries/jobs";
import { useUserStore } from "@/lib/stores/useUserStore";
import { InfiniteJobsList } from "@/components/jobs/InfiniteJobsList";

export default function WorkerSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const { user } = useUserStore();

  const filters = [
    { label: "All", value: "all" },
    { label: "Urgent", value: "urgent" },
    { label: "High Pay", value: "highpay" },
    { label: "Nearest", value: "nearest" },
  ];

  return (
    <div className="worker-container">
      <div className="worker-layout">
        {/* Header */}
        <div className="worker-header">
          <div className="worker-header-content">
            <h1 className="worker-header-title">Jobs</h1>
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
        <div className="px-4 py-6">
          <InfiniteJobsList searchQuery={searchQuery} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <WorkerNav />
    </div>
  );
}

