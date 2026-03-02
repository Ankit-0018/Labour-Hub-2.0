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
    fullName: data.name,
    role: data.role,
    averageRating: workerProfile?.averageRating,
    memberSince: data.createdAt.toDate(),
    ratingCount: data.ratingCount ?? 0,
    completedJobsCount: data.completedJobsCount ?? 0,
    totalEarnings: workerProfile?.totalEarnings ?? 0,
    phone: data.phone,
    dailyWage: workerProfile?.dailyWage ?? null,
    skills: workerProfile?.skills ?? null,
    email: data.email ?? null,
    workStatus: workerProfile?.status ?? null,
    location: data?.location ?? null
  };
};