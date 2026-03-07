"use client";
import { MapPin, Briefcase, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/stores/useUserStore";
import { Button } from "@/components/ui/button";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import "@/styles/worker.css";
import { WorkerHeader } from "@/components/worker/worker-header";
import ShareLocation from "@/components/worker/share-location";
import Spinner from "@/components/_shared/spinner";
import { getWorkerDashboard } from "@/lib/queries/dashboard";
import { updateWorkerAvailability } from "@/lib/actions/worker";
import { WorkerStatus, WorkerDashboardData } from "@/lib/types";

const STATUS_OPTIONS: {
  value: WorkerStatus;
  label: string;
  color: string;
}[] = [
  { value: "available", label: "Available", color: "bg-green-500" },
  { value: "busy", label: "Busy", color: "bg-yellow-500" },
  { value: "offline", label: "Offline", color: "bg-gray-400" },
];

export default function WorkerHomeUI() {
  const { user, location, locationLoading } = useUserStore();
  const [workStatus, setWorkStatusState] = useState<WorkerStatus>("available");
  const [data, setData] = useState<WorkerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  if (!user) return null;

  const handleStatusChange = async (newStatus: WorkerStatus) => {
    setWorkStatusState(newStatus);
    try {
      await updateWorkerAvailability(user.uid, newStatus);
    } catch (error) {
      alert("Failed to change availability");
    }
  };

  useEffect(() => {
    if (!user?.uid || !location?.lat || !location?.lng)
      return;

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const res = await getWorkerDashboard(
          user.uid,
          location.lat,
          location.lng,
          location.city ?? ""
        );
        setData(res);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, location]);

  const statusInfo = STATUS_OPTIONS.find((s) => s.value === workStatus);
  const isWorking = workStatus !== "offline";

  return (
    <div className="worker-container">
      <div className="worker-layout">
        <WorkerHeader title="Labour Hub" />

        {/* Location Info */}
        <div className="location-info">
          <MapPin className="w-4 h-4" />
          {locationLoading ? (
            <Spinner />
          ) : (
            <span className="text-sm">
              {location ? `${location.address}` : "Location disabled"}
            </span>
          )}
        </div>

        {/* Main Content */}
        <div className="px-4 py-6 space-y-4 pb-32">
          {/* Status Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Your Status
              </h2>
              <div
                className={`w-3 h-3 rounded-full ${statusInfo?.color}`}
              ></div>
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
                  ? "You are busy but still visible to employers."
                  : "You are not visible to employers."}
            </p>
          </div>

          <ShareLocation />

          {/* Quick Stats */}
          {isWorking && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {data?.nearbyJobsCount ?? 0}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Nearby Jobs
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">
                    {data?.closestJobDistance ?? "N/A"}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Closest Job
                  </p>
                </div>
              </div>

              {/* Earnings Card */}
              <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <p className="text-xs text-gray-600 mb-1">
                  Today's Earnings
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{data?.todayEarnings ?? 0}
                </p>
              </div>

              {/* Action Button */}
              <Link href="/worker/search">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl">
                  <Briefcase className="w-4 h-4 mr-2" />
                  View Nearby Jobs
                </Button>
              </Link>
            </>
          )}

          {/* Profile Summary Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Your Profile
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Skill</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {user?.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-sm font-semibold text-gray-900"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  Daily Rate
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  ₹{user?.dailyWage}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  Jobs Done
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {user?.completedJobsCount}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">Rating</span>
                <span className="text-sm font-semibold text-yellow-500">
                  {user?.averageRating} ⭐ ({user?.ratingCount})
                </span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <p className="font-medium mb-1">
                Complete Your Profile
              </p>
              <p>Add your photo and reviews to increase your chances of getting hired.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <WorkerNav />
    </div>
  );
}
