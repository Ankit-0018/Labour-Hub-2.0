import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/firebase-admin";

export async function getCurrentUserId() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;

  if (!token) {
    throw new Error("User not authenticated");
  }

  // Verify token with Firebase Admin
  const decodedToken = await adminAuth.verifyIdToken(token);

  return decodedToken.uid;
}