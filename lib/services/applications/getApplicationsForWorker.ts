import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export async function getApplicationsForWorker(workerId: string) {
  if (!workerId) throw new Error("Worker ID is required");

  const q = query(
    collection(db, "applications"),
    where("workerId", "==", workerId),
    orderBy("appliedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
