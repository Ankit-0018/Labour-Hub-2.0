"use client";

import BottomBar from "@/components/_shared/bottom-bar";
import JobCard from "@/components/cards/job";
import { logout } from "@/lib/utils/auth";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useLiveLocation } from "@/hooks/useLiveLocation";
import { useUserStore } from "@/lib/stores/useUserStore";

const LiveMap = dynamic(() => import("@/components/common/LiveMap"), {
  ssr: false,
});

const Home = () => {
  const router = useRouter();
  const { location, locationError } = useUserStore();
  const { startTracking, stopTracking, isTracking } = useLiveLocation();
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth?mode=login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-5 pb-24">
      {/* Location Header */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="text-blue-500" size={18} />
        <span className="text-sm text-gray-700">
          {isTracking && location
            ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
            : "Location not shared"}
        </span>
      </div>

      {locationError && (
        <p className="text-sm text-red-500 mb-3">{locationError}</p>
      )}

      {/* Live Map */}
      {isTracking && location && (
        <div className="w-full h-[300px] rounded-lg overflow-hidden mb-6">
          <LiveMap lat={location.lat} lng={location.lng} />
        </div>
      )}

      {/* Active Toggle */}
      <div className="mb-6">
        <button
          onClick={() => (!isTracking ? startTracking() : stopTracking())}
          className={`w-full py-4 rounded-xl text-lg font-semibold text-white transition
            ${
              isTracking
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
        >
          {isTracking ? "🟢 Active for Work" : "⚪ Inactive"}
        </button>

        <p className="text-center text-xs text-gray-500 mt-2">
          {isTracking
            ? "Your live location is shared with employers"
            : "You are currently not visible to employers"}
        </p>
      </div>

      {/* Nearby Work */}
      <h2 className="text-base font-semibold mb-3">
        Work near you (within 3 km)
      </h2>

      <div className="space-y-3">
        <JobCard
          title="Mason (मिस्त्री) की आवश्यकता है"
          location="Rourkela Industrial Township (ITS), Odisha"
          salary="₹19,500"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsWOSF50BVvHSLNuAVIMx-w5p_IcRWhT8njg&s"
        />
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 py-2 px-4 text-white rounded-md bg-red-600"
      >
        Log Out
      </button>

      <BottomBar />
    </div>
  );
};

export default Home;