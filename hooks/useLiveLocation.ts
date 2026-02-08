"use client";

import { useUserStore } from "@/lib/stores/useUserStore";
import { useEffect, useRef, useState } from "react";

export interface Location {
  lat: number;
  lng: number;
}

export function useLiveLocation() {
  const { setLocation, setLocationError, setLocationPermission } = useUserStore();
  const watchIdRef = useRef<number | null>(null);

  const startTracking = () => {
    if (watchIdRef.current !== null) return; // 🛑 already tracking

    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setLocationPermission("granted");

        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: Date.now(),
        });
      },
      (err) => {
        setLocationPermission("denied");
        setLocationError(err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current === null) return;

    navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
  };

  // auto stop when component unmounts
  useEffect(() => {
    return () => stopTracking();
  }, []);

  return {
    startTracking,
    stopTracking,
    isTracking: watchIdRef.current !== null,
  };
}
