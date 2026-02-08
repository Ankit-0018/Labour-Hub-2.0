export async function getAddressFromCoords(lat: number, lon: number) {
  const res = await fetch(
    `/api/reverse-geocode?lat=${lat}&lon=${lon}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch address");
  }

  const data = await res.json();
  return data.address as string;
}
