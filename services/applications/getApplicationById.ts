import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getEmployerById(userId: string) {
  if (!userId) throw new Error("User ID is required");

  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);

  if (!snap.exists()) throw new Error("User not found");

  const data = snap.data();

  if (data.role !== "employer" || !data.employer) {
    throw new Error("User is not an employer");
  }

  return {
    id: snap.id,
    name: data.name,
    phone: data.phone,
    avatar: data.avatar ?? null,
    ...data.employer,
  };
}
