import { geohashForLocation } from "geofire-common";

export async function prepareLocation(lat: number, lng: number) {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: lat.toString(),
    lon: lng.toString(),
    addressdetails: "1",
    zoom: "18",
    "accept-language": "en",
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
    {
      headers: {
        "Accept": "application/json",
        "User-Agent": "LabourHub/1.0 (contact@labourhub.com)",
      },
    }
  );

  if (!res.ok) throw new Error("Reverse geocode failed");

  const data = await res.json();
  const a = data.address;

  const city =
    a.city ||
    a.town ||
    a.village ||
    a.county ||
    "";

  const address = [
    a.house_number,
    a.road,
    a.suburb || a.neighbourhood,
    city,
  ]
    .filter(Boolean)
    .join(", ");

  const geohash = geohashForLocation([lat, lng]);

  return {
    lat,
    lng,
    address,
    city,
    geohash,
  };
}