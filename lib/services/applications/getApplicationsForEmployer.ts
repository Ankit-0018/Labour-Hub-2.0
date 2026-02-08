import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export async function getApplicationsForEmployer(employerId: string) {
  if (!employerId) throw new Error("Employer ID is required");

  const q = query(
    collection(db, "applications"),
    where("employerId", "==", employerId),
    orderBy("appliedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
