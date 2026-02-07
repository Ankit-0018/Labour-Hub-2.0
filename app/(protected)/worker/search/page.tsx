'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WorkerNav } from '@/components/navigation/WorkerNav';
import { JobCard } from '@/components/cards/JobCard';
import '@/styles/worker.css';
import { Search as SearchIcon, Filter } from 'lucide-react';

// Dummy jobs data
const DUMMY_JOBS = [
  {
    id: "1",
    title: "विद्युत मरम्मत / Electrical Repair",
    skill: "Electrician / इलेक्ट्रीशियन",
    wage: 1200,
    duration: "पूरा दिन / Full Day",
    distance: 0.8,
    companyName: "ABC Building",
  },
  {
    id: "2",
    title: "वायरिंग स्थापन / Wiring Installation",
    skill: "Electrician / इलेक्ट्रीशियन",
    wage: 1500,
    duration: "8 घंटे / 8 Hours",
    distance: 1.2,
    companyName: "XYZ Corp",
  },
  {
    id: "3",
    title: "पैनल मरम्मत / Panel Repair",
    skill: "Electrician / इलेक्ट्रीशियन",
    wage: 900,
    duration: "4 घंटे / 4 Hours",
    distance: 2.1,
    companyName: "City Services",
  },
  {
    id: "4",
    title: "आपातकालीन वायरिंग / Emergency Wiring",
    skill: "Electrician / इलेक्ट्रीशियन",
    wage: 2000,
    duration: "पूरा दिन / Full Day",
    distance: 2.8,
    companyName: "Premium Services",
  },
  {
    id: "5",
    title: "घर विद्युत सेटअप / Home Electrical Setup",
    skill: "Electrician / इलेक्ट्रीशियन",
    wage: 1800,
    duration: "पूरा दिन / Full Day",
    distance: 0.5,
    companyName: "BuildCo",
  },
];

const skills = ["Electrician / इलेक्ट्रीशियन"]; // Declare the skills variable

export default function WorkerSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const filters = [
    { label: "सब / All", value: "all" },
    { label: "तुरंत / Urgent", value: "urgent" },
    { label: "अधिक पे / High Pay", value: "highpay" },
    { label: "निकट / Nearest", value: "nearest" },
  ];

  const filteredJobs = DUMMY_JOBS.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.companyName && job.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }).sort((a, b) => {
    if (selectedSkill === "nearest") return a.distance - b.distance;
    if (selectedSkill === "highpay") return b.wage - a.wage;
    return 0;
  });

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
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {job.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {job.companyName}
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
                        {job.skill}
                      </span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {job.distance} km
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 bg-transparent"
                      >
                        मना / Decline
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs h-8 bg-green-600 hover:bg-green-700"
                      >
                        स्वीकार / Accept
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
