"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search as SearchIcon,
  MapPin,
  Star,
  Briefcase,
  Phone,
  ChevronLeft,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { EmployerNav } from "@/components/navigation/EmployerNav";

const DUMMY_WORKERS = [
  {
    id: "1",
    name: "Rajesh Kumar",
    skill: "Electrician / इलेक्ट्रीशियन",
    rating: 4.8,
    reviews: 45,
    wage: 1200,
    distance: 0.5,
    verified: true,
    image: "👨‍🔧",
  },
  {
    id: "2",
    name: "Amit Singh",
    skill: "Mason / मिस्त्री",
    rating: 4.5,
    reviews: 32,
    wage: 1000,
    distance: 1.2,
    verified: true,
    image: "👨‍🔨",
  },
  {
    id: "3",
    name: "Pradeep Sharma",
    skill: "Carpenter / बढ़ई",
    rating: 4.7,
    reviews: 28,
    wage: 1100,
    distance: 1.8,
    verified: false,
    image: "👨‍🔧",
  },
  {
    id: "4",
    name: "Vikram Patel",
    skill: "Plumber / प्लंबर",
    rating: 4.3,
    reviews: 18,
    wage: 950,
    distance: 2.1,
    verified: true,
    image: "👨‍🔨",
  },
  {
    id: "5",
    name: "Suresh Das",
    skill: "Painter / पेंटर",
    rating: 4.6,
    reviews: 24,
    wage: 850,
    distance: 2.5,
    verified: true,
    image: "👨‍🔧",
  },
];

export default function SearchWorkersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const filters = ["सब / All", "निकट / Nearest", "शीर्ष रेटेड / Top Rated"];

  const filteredWorkers = DUMMY_WORKERS.filter((worker) => {
    return (
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skill.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }).sort((a, b) => {
    if (selectedSkill === "निकट / Nearest") return a.distance - b.distance;
    if (selectedSkill === "शीर्ष रेटेड / Top Rated")
      return b.rating - a.rating;
    return 0;
  });

  const toggleFavorite = (workerId: string) => {
    setFavorites((prev) =>
      prev.includes(workerId)
        ? prev.filter((id) => id !== workerId)
        : [...prev, workerId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-blue-600 text-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/employer/home">
            <ChevronLeft className="w-6 h-6 cursor-pointer hover:opacity-80" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">मजदूर खोजें</h1>
            <p className="text-sm text-blue-100">Search workers</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-3 sticky top-16 z-30 bg-white border-b border-gray-200">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <SearchIcon className="w-4 h-4 absolute left-3 top-3.5 text-gray-500" />
            <Input
              placeholder="नाम या कौशल खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-lg"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedSkill(selectedSkill === filter ? null : filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                selectedSkill === filter
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Workers List */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4 pb-12">
        {filteredWorkers.length > 0 ? (
          <>
            <p className="text-sm text-gray-600">
              {filteredWorkers.length} मजदूर मिले / {filteredWorkers.length}{" "}
              workers found
            </p>

            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl flex-shrink-0">
                        {worker.image}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {worker.name}
                          </h3>
                          {worker.verified && (
                            <span className="text-blue-600">✓</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{worker.skill}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(worker.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <Heart
                        className="w-5 h-5"
                        fill={favorites.includes(worker.id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  {/* Rating and Distance */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">
                        {worker.rating}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({worker.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{worker.distance} km</span>
                    </div>
                  </div>

                  {/* Wage and Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">दैनिक दर / Daily</p>
                      <p className="text-lg font-bold text-green-600">
                        ₹{worker.wage}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/employer/worker/${worker.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-9 bg-transparent"
                        >
                          प्रोफाइल / Profile
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="text-xs h-9 bg-blue-600 hover:bg-blue-700"
                      >
                        <Briefcase className="w-3 h-3 mr-1" />
                        नौकरी दें / Hire
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🔍</p>
            <h3 className="font-semibold text-gray-900 mb-1">
              कोई मजदूर नहीं मिला
            </h3>
            <p className="text-gray-600 text-sm">No workers found</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <EmployerNav />
    </div>
  );
}
