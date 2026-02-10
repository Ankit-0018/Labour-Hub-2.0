"use client";

import { MapPin, MapPinOff, Briefcase, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useUserStore } from "@/lib/stores/useUserStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkerNav } from "@/components/navigation/WorkerNav";

const STATUS_OPTIONS = [
  { value: "available", label: "उपलब्ध / Available", color: "bg-green-500" },
  { value: "busy", label: "व्यस्त / Busy", color: "bg-yellow-500" },
  { value: "offline", label: "ऑफ़लाइन / Offline", color: "bg-gray-400" },
];

function WorkerHomeSkeleton() {
  return (
    <div className="worker-container">
      <div className="worker-layout px-4 py-6 space-y-4 pb-32">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-3 w-full" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkerHomePage() {
  const { user, hydrated, location, setLocation, clearLocation } = useUserStore();
  const [nearbyJobs] = useState(8);
  const [workStatus, setWorkStatusState] = useState("available");

  const handleStatusChange = async (newStatus: string) => {
    setWorkStatusState(newStatus);
    // TODO: Update Firebase when ready
  };

  const toggleLocation = async () => {
    if (location) {
      // Turn off location
      clearLocation();
    } else {
      // Turn on location - get current position
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            alert("Unable to get your location. Please enable location permissions.");
          }
        );
      }
    }
  };

  if (!hydrated) {
    return <WorkerHomeSkeleton />;
  }

  const locationEnabled = !!location;

  const statusInfo = STATUS_OPTIONS.find((s) => s.value === workStatus);
  const isWorking = workStatus !== "offline";

  return (
    <div className="worker-container">
      <div className="worker-layout">
        {/* Header */}
        <div className="worker-header">
          <div className="worker-header-content">
            <h1 className="worker-header-title">Labour Hub</h1>
            <div className="worker-header-actions">
              <Link
                href="/worker/home#notifications"
                className="text-primary-foreground hover:text-primary-foreground/80"
              >
                🔔
              </Link>
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="location-info">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">
            {locationEnabled ? "Sector 5, Gurgaon" : "Location disabled"}
          </span>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6 space-y-4 pb-32">
          {/* Status Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                आपकी स्थिति / Your Status
              </h2>
              <div className={`w-3 h-3 rounded-full ${statusInfo?.color}`}></div>
            </div>

            {/* Status Selector */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center text-xs font-medium ${
                    workStatus === status.value
                      ? "border-blue-600 bg-blue-50 text-blue-900"
                      : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>

            {/* Status Description */}
            <p className="text-xs text-gray-600">
              {workStatus === "available"
                ? "You are visible to employers."
                : workStatus === "busy"
                  ? "You are busy but visible."
                  : "You are not visible to employers."}
            </p>
          </div>

          {/* Location Toggle */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {locationEnabled ? (
                  <MapPin className="w-5 h-5 text-blue-600" />
                ) : (
                  <MapPinOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    स्थान साझा करें / Share Location
                  </p>
                  <p className="text-xs text-gray-600">
                    {locationEnabled ? "On - Jobs visible within 3 km" : "Off"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleLocation}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  locationEnabled ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    locationEnabled ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Map Simulation */}
          {locationEnabled && (
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-4 h-48 flex items-center justify-center relative border border-blue-200 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center z-10">
                  <div className="text-3xl mb-2">📍</div>
                  <p className="text-xs font-medium text-gray-700">
                    Your Location
                  </p>
                </div>
              </div>
              <div className="absolute w-32 h-32 rounded-full border-2 border-blue-300 border-dashed opacity-50"></div>
            </div>
          )}

          {/* Quick Stats */}
          {isWorking && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">{nearbyJobs}</div>
                  <p className="text-xs text-gray-600 mt-1">
                    पास में काम / Nearby Jobs
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">3.2 km</div>
                  <p className="text-xs text-gray-600 mt-1">
                    निकटतम काम / Closest Job
                  </p>
                </div>
              </div>

              {/* Earnings Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <p className="text-xs text-gray-600 mb-1">
                  आज की कमाई / Today&apos;s Earnings
                </p>
                <p className="text-3xl font-bold text-green-600">₹2,500</p>
              </div>

              {/* Action Button */}
              <Link href="/worker/search">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl">
                  <Briefcase className="w-4 h-4 mr-2" />
                  पास में काम देखें / View Nearby Jobs
                </Button>
              </Link>
            </>
          )}

          {/* Profile Summary Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              आपकी प्रोफ़ाइल / Your Profile
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">कौशल / Skill</span>
                <span className="text-sm font-semibold text-gray-900">
                  {user?.skillName || "Not set"}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">दैनिक दर / Daily Rate</span>
                <span className="text-sm font-semibold text-gray-900">₹800</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">पूर्ण किए गए काम / Jobs Done</span>
                <span className="text-sm font-semibold text-gray-900">128</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">रेटिंग / Rating</span>
                <span className="text-sm font-semibold text-yellow-500">4.8 ⭐</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <p className="font-medium mb-1">प्रोफाइल सुधारें / Complete Profile</p>
              <p>फोटो और समीक्षा जोड़ें किराए के मौके बढ़ाने के लिए।</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <WorkerNav />
    </div>
  );
}
