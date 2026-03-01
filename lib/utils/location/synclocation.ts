import { useUserStore } from "@/lib/stores/useUserStore";

export async function syncLocation(coords: { lat: number; lng: number }) {
  const { user, setLocation } = useUserStore.getState();
  if (!user?.uid) {
    throw new Error("User not available");
  }
  const res = await fetch("/api/location/reverse-geocode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid: user.uid,
      lat: coords.lat,
      lng: coords.lng,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("API Error:", err);
    throw new Error("Location update failed");
  }

  const data = await res.json();
  setLocation({
    lat: coords.lat,
    lng: coords.lng,
    address: data.address,
    city: data.city,
    geohash: data.geohash,
  });
}