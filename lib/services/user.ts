import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { UserData } from "../stores/useUserStore";

export const getUserProfile = async (uid: string): Promise<UserData | null>=> {
  const snap = await getDoc(doc(db, "users", uid));

  if (!snap.exists()) return null;

   const data = snap.data();
    const workerProfile = data.worker ?? null;
  return {
    uid: snap.id,
    role: data.role,
    rating: workerProfile?.averageRating,
    phone: data.phone,
    dailyWage: workerProfile?.dailyWage ?? null,
    skills: workerProfile?.skills ?? null,
    email: data.email ?? null,
    workStatus: workerProfile?.status ?? null,
  };
};