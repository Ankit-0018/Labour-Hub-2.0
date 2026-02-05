"use client";

import { useLiveLocation } from "@/hooks/useLiveLocation";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getAddressFromCoords } from "@/lib/utils/getaddress";
import { useLocationStore } from "@/lib/stores/useLocationStore";

const LiveMap = dynamic(() => import("@/components/common/LiveMap"), {
  ssr: false,
});

interface LocationFieldProps {
  showMap?: boolean; 
}

export default function LocationField({ showMap = false }: LocationFieldProps) {
  const [active, setActive] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const { location , error} = useLocationStore();
  const {  startTracking, stopTracking } = useLiveLocation();

  const toggleActive = () => {
    if (!active) {
      startTracking();
      setActive(true);
    } else {
      stopTracking();
      setActive(false);
    }
  };

 useEffect(() => {
  if (!location || address) return; 

  setLoadingAddress(true);

  getAddressFromCoords(location.lat, location.lng)
    .then((addr) => setAddress(addr))
    .catch(() => setAddress("Unable to fetch address"))
    .finally(() => setLoadingAddress(false));
}, [location, address]);

  return (
    <div className="space-y-3">
      {/* Location display */}
      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <MapPin className="w-5 h-5 text-blue-600 shrink-0" />

        {loadingAddress ? (
          <span className="text-sm text-gray-600">
            Detecting location…
          </span>
        ) : address ? (
          <span className="text-sm text-gray-900">
            {address}
          </span>
        ) : (
          <span className="text-sm text-gray-600">
            Location not selected
          </span>
        )}

        <span className="ml-auto text-xs text-gray-600">
          3 km radius
        </span>
      </div>

      {/* Map (optional) */}
      {showMap && active && location && (
        <div className="w-full h-75 rounded-lg overflow-hidden border">
          <LiveMap lat={location.lat} lng={location.lng} />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

      {/* Action */}
      <button
        type="button"
        onClick={toggleActive}
        className={`px-3 py-1.5 text-xs font-medium rounded-md text-white ${
          active
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {active ? "Stop Location" : "Select Location"}
      </button>

      <p className="text-xs text-gray-600">
        स्वचालित रूप से पता लगाया जाएगा। Automatically detected using GPS.
      </p>
    </div>
  );
}
