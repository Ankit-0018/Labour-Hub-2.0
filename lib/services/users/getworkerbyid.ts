import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export async function getWorkerById(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User not found");
  }

  const userData = userSnap.data();

  if (userData.role !== "worker" || !userData.worker) {
    throw new Error("User is not a worker");
  }

  return {
    id: userSnap.id,
    name: userData.name,
    phone: userData.phone,
    avatar: userData.avatar ?? null,
    ...userData.worker,
  };
}
