export function serializeFirestore(data: any) {
  if (!data) return data;

  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      // Convert Firestore Timestamp → ISO string
      if (value?._seconds !== undefined && value?._nanoseconds !== undefined) {
        return new Date(value._seconds * 1000).toISOString();
      }

      return value;
    })
  );
}
