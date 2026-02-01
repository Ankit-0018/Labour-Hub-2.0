import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Missing coordinates" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    format: "jsonv2",
    lat,
    lon,
    addressdetails: "1",
    zoom: "18",
    "accept-language": "en",
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
    {
      headers: {
        "Accept": "application/json",
        // ✅ This works ONLY on server
        "User-Agent": "LabourHub/1.0 (contact@labourhub.com)",
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Reverse geocoding failed" },
      { status: 500 }
    );
  }

  const data = await res.json();
  const a = data.address;

  const address = [
    a.house_number,
    a.road,
    a.suburb || a.neighbourhood,
    a.city || a.town || a.village,
  ].filter(Boolean).join(", ");

  return NextResponse.json({ address });
}
