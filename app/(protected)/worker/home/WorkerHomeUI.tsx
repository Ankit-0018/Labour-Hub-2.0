"use client";
import { MapPin, MapPinOff, Briefcase, AlertCircle, ClipboardList, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUserStore } from "@/lib/stores/useUserStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import "@/styles/worker.css";
import { getAddressFromCoords } from "@/lib/utils/location/getaddress";
import { WorkerHeader } from "@/components/worker/worker-header";
import ShareLocation from "@/components/worker/share-location";
import { updateWorkerStatusAction } from "@/lib/server/actions";

type Props = {
  data: {
    stats: {
      activeJobsCount: number;
      applicationsCount: number;
      completedJobsCount: number;
      totalEarnings: number;
    };
    profile: {
      dailyWage: number;
      ratingAverage: number;
      ratingCount: number;
      skills: string[];
    };
    nearbyJobsCount: number;
    closestJobDistance: string;
    todayEarnings: number;
  };
};

const STATUS_OPTIONS = [
  { value: "available", label: "उपलब्ध / Available", color: "bg-green-500" },
  { value: "busy", label: "व्यस्त / Busy", color: "bg-yellow-500" },
  { value: "offline", label: "ऑफ़लाइन / Offline", color: "bg-gray-400" },
];

// function WorkerHomeSkeleton() {
//   return (
//     <div className="worker-container">
//       <div className="worker-layout px-4 py-6 space-y-4 pb-32">
//         {/* Header */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//           <div className="flex justify-between items-center">
//             <Skeleton className="h-6 w-24" />
//             <Skeleton className="h-6 w-6 rounded-full" />
//           </div>
//         </div>

//         {/* Location */}
//         <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
//           <div className="flex items-center gap-3">
//             <Skeleton className="h-4 w-4 rounded-full" />
//             <Skeleton className="h-4 w-32" />
//           </div>
//         </div>

//         {/* Status Card */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//           <Skeleton className="h-4 w-32 mb-4" />
//           <div className="grid grid-cols-3 gap-2 mb-4">
//             {[1, 2, 3].map((i) => (
//               <Skeleton key={i} className="h-14 rounded-lg" />
//             ))}
//           </div>
//           <Skeleton className="h-3 w-full" />
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
//             <Skeleton className="h-8 w-12 mb-2" />
//             <Skeleton className="h-3 w-20" />
//           </div>
//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
//             <Skeleton className="h-8 w-16 mb-2" />
//             <Skeleton className="h-3 w-16" />
//           </div>
//         </div>

//         {/* Profile */}
//         <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
//           <Skeleton className="h-4 w-32 mb-4" />
//           <div className="space-y-3">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="flex justify-between">
//                 <Skeleton className="h-3 w-20" />
//                 <Skeleton className="h-3 w-24" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function WorkerHomeUI({ data }: Props) {
  const { location } = useUserStore();
  //   const [nearbyJobs] = useState(8);
  const [workStatus, setWorkStatusState] = useState("available");
  const [mounted, setMounted] = useState(false);
  const [address, setAddress] = useState("");
  // Ensure component is mounted on client
  useEffect(() => {
    console.log(data.profile.skills)
    setMounted(true);
    const fetchAddress = async () => {
      if (!location) return;
      const address = await getAddressFromCoords(location?.lat, location?.lng);
      setAddress(address);
    };
    if (location) {
      fetchAddress();
    }
  }, [location]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setWorkStatusState(newStatus);
      await updateWorkerStatusAction(newStatus as "available" | "busy" | "offline");
    } catch (err) {
      console.error(err);
      alert("स्थिति अपडेट करने में विफल");
    }
  };

  const locationEnabled = !!location;

  const statusInfo = STATUS_OPTIONS.find((s) => s.value === workStatus);
  const isWorking = workStatus !== "offline";

  return (
    <div className="worker-container">
      <div className="worker-layout">
        <WorkerHeader title="Labour Hub" />
        {/* Location Info */}
        <div className="location-info">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">
            {locationEnabled ? `${address}` : "Location disabled"}
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
                  className={`p-3 rounded-lg border-2 transition-all text-center text-xs font-medium ${workStatus === status.value
                    ? "border-blue-600 bg-blue-50 text-blue-900"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                    }`}
                >
                  {status.label}
                </button>
              ))}
            </div>

            {/* Status Description */}
            <p className="text-xs text-gray-600 mb-4">
              {workStatus === "available"
                ? "You are visible to employers."
                : workStatus === "busy"
                  ? "You are busy but visible."
                  : "You are not visible to employers."}
            </p>

            <Link href="/worker/applications" className="block">
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-center justify-between group hover:bg-blue-100/50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-900">मेरे आवेदन / My Applications</p>
                    <p className="text-[10px] text-blue-600">{data.stats.applicationsCount} active submission(s)</p>
                  </div>
                </div>
                <div className="text-blue-400 group-hover:translate-x-1 transition-transform">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>

          <ShareLocation />

          {/* Quick Stats */}
          {isWorking && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {data.nearbyJobsCount}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    पास में काम / Nearby Jobs
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">
                    {data.closestJobDistance}
                  </div>
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
                <p className="text-3xl font-bold text-green-600">
                  ₹{data.todayEarnings}
                </p>
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
                  {data.profile.skills.join(", ") || "None"}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  दैनिक दर / Daily Rate
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  ₹{data.profile.dailyWage}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  पूर्ण किए गए काम / Jobs Done
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {data.stats.completedJobsCount}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">रेटिंग / Rating</span>
                <span className="text-sm font-semibold text-yellow-500">
                  {data.profile.ratingAverage} ⭐ ({data.profile.ratingCount})
                </span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <p className="font-medium mb-1">
                प्रोफाइल सुधारें / Complete Profile
              </p>
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
