export function serializeFirestore(data: any) {
  if (!data) return data;

  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      // Convert Firestore Timestamp → ISO string
      if (value?._seconds !== undefined && value?._nanoseconds !== undefined) {
        return new Date(value._seconds * 1000).toISOString();
      }

      // Convert Firestore GeoPoint → plain object
      if (value?._latitude !== undefined && value?._longitude !== undefined) {
        return { lat: value._latitude, lng: value._longitude };
      }
      if (value?._lat !== undefined && value?._long !== undefined) {
        return { lat: value._lat, lng: value._long };
      }

      return value;
    })
  );
}
