import { adminDb } from "@/lib/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { serializeFirestore } from "@/lib/utils/firebase/serializeFirestore";

export async function getWorkerHomeData(uid: string) {
  if (!uid) {
    throw new Error("UID is required");
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // 1️⃣ Active Jobs (Assigned to this worker and still active)
  const activeQuery = adminDb.collection("jobAssignments")
    .where("workerId", "==", uid)
    .where("status", "==", "active");

  // 2️⃣ Applications (Submitted by this worker)
  const appsQuery = adminDb.collection("jobApplications")
    .where("workerId", "==", uid);

  // 3️⃣ Completed Jobs (All Time for this worker)
  const completedQuery = adminDb.collection("jobAssignments")
    .where("workerId", "==", uid)
    .where("status", "==", "completed");

  // 4️⃣ Today's Completed Jobs (for earnings)
  const todayQuery = adminDb.collection("jobAssignments")
    .where("workerId", "==", uid)
    .where("status", "==", "completed")
    .where("completedAt", ">=", startOfDay)
    .where("completedAt", "<=", endOfDay);

  // 5️⃣ Nearby Jobs (Dynamic: for now, all 'open' jobs)
  const openJobsQuery = adminDb.collection("jobs")
    .where("status", "==", "open")
    .limit(20);

  const [activeSnap, appsSnap, completedSnap, todaySnap, openJobsSnap, userSnap] =
    await Promise.all([
      activeQuery.get(),
      appsQuery.get(),
      completedQuery.get(),
      todayQuery.get(),
      openJobsQuery.get(),
      adminDb.collection("users").doc(uid).get(),
    ]);

  const userData = userSnap.data();
  if (!userData) {
    throw new Error("User not found");
  }

  // 🔢 Calculate Today's Earnings
  let todayEarnings = 0;
  todaySnap.forEach((doc) => {
    const wage = Number(doc.data().wage ?? 0);
    todayEarnings += wage;
  });

  // 🔢 Calculate Total Earnings (All Time)
  let totalEarnings = 0;
  completedSnap.forEach((doc) => {
    const wage = Number(doc.data().wage ?? 0);
    totalEarnings += wage;
  });

  return serializeFirestore({
    stats: {
      activeJobsCount: activeSnap.size,
      applicationsCount: appsSnap.size,
      completedJobsCount: completedSnap.size,
      totalEarnings,
    },

    profile: {
      dailyWage: Number(userData?.workerProfile?.dailyWage ?? 0),
      ratingAverage: Number(userData?.workerProfile?.ratingAverage ?? 0),
      ratingCount: Number(userData?.workerProfile?.ratingCount ?? 0),
      skills: userData?.workerProfile?.skills ?? [],
    },

    nearbyJobsCount: openJobsSnap.size,
    closestJobDistance: openJobsSnap.size > 0 ? "Nearby" : "N/A", // Placeholder for actual distance logic
    todayEarnings,
  });
}

export async function getOpenJobs() {
  const snap = await adminDb.collection("jobs")
    .where("status", "==", "open")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return snap.docs.map(doc => {
    const data = doc.data();
    return serializeFirestore({
      id: doc.id,
      title: data.title,
      description: data.description,
      wage: Number(data.wage),
      duration: data.duration,
      skillsRequired: data.skillsRequired || [],
      employerId: data.employerId,
      location: data.location,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      photoUrl: data.photoUrl || `https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=500&auto=format&fit=crop`,
    });
  });
}

export async function getJobById(jobId: string) {
  if (!jobId) throw new Error("Job ID is required");
  const doc = await adminDb.collection("jobs").doc(jobId).get();
  if (!doc.exists) return null;
  const data = doc.data()!;
  return serializeFirestore({
    id: doc.id,
    title: data.title || "Untitled Job",
    description: data.description || "",
    wage: Number(data.wage) || 0,
    duration: data.duration || "",
    skillsRequired: data.skillsRequired || [],
    employerId: data.employerId,
    location: data.location,
    status: data.status,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    photoUrl: data.photoUrl || `https://images.unsplash.com/photo-1581578731522-9b7d7b89751f?q=80&w=500&auto=format&fit=crop`,
  });
}

export async function getWorkerEarningsData(uid: string) {
  if (!uid) throw new Error("UID is required");

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todaySnap, weekSnap, monthSnap, allSnap, pendingSnap] = await Promise.all([
    adminDb.collection("jobAssignments")
      .where("workerId", "==", uid)
      .where("status", "==", "completed")
      .where("completedAt", ">=", startOfToday)
      .get(),
    adminDb.collection("jobAssignments")
      .where("workerId", "==", uid)
      .where("status", "==", "completed")
      .where("completedAt", ">=", startOfWeek)
      .get(),
    adminDb.collection("jobAssignments")
      .where("workerId", "==", uid)
      .where("status", "==", "completed")
      .where("completedAt", ">=", startOfMonth)
      .get(),
    adminDb.collection("jobAssignments")
      .where("workerId", "==", uid)
      .where("status", "==", "completed")
      .get(),
    adminDb.collection("jobAssignments")
      .where("workerId", "==", uid)
      .where("status", "==", "active")
      .get(),
  ]);

  const calculateTotal = (snap: FirebaseFirestore.QuerySnapshot) =>
    snap.docs.reduce((acc, doc) => acc + (Number(doc.data().wage) || 0), 0);

  const transactions = [...allSnap.docs, ...pendingSnap.docs]
    .map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        description: data.title || "Job Settlement",
        amount: Number(data.wage) || 0,
        status: data.status,
        date: data.completedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date(),
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  return serializeFirestore({
    today: calculateTotal(todaySnap),
    thisWeek: calculateTotal(weekSnap),
    thisMonth: calculateTotal(monthSnap),
    total: calculateTotal(allSnap),
    pending: calculateTotal(pendingSnap),
    transactions: transactions.map(t => ({
      ...t,
      date: t.date.toLocaleDateString('hi-IN', { day: '2-digit', month: 'short' })
    }))
  });
}

export async function getWorkerProfileData(uid: string) {
  if (!uid) throw new Error("UID is required");

  const userSnap = await adminDb.collection("users").doc(uid).get();
  const userData = userSnap.data();

  if (!userData) throw new Error("User not found");

  const completedSnap = await adminDb.collection("jobAssignments")
    .where("workerId", "==", uid)
    .where("status", "==", "completed")
    .get();

  let totalEarnings = 0;
  completedSnap.forEach(doc => {
    const wage = Number(doc.data().wage);
    if (!isNaN(wage)) {
      totalEarnings += wage;
    }
  });

  const profile = {
    name: userData.name || "Worker Name",
    phone: userData.phone || "Not set",
    email: userData.email || "Not set",
    location: userData.location?.latitude ?
      "Gurgaon, Haryana" :
      (typeof userData.location === 'string' ? userData.location : "Gurgaon, Haryana"),
    skill: userData.workerProfile?.skills?.[0] || "General",
    dailyWage: Number(userData.workerProfile?.dailyWage) || 0,
    rating: Number(userData.workerProfile?.ratingAverage) || 0,
    reviews: Number(userData.workerProfile?.ratingCount) || 0,
    jobsCompleted: completedSnap.size,
    totalEarnings,
    memberSince: userData.createdAt?.toDate ?
      userData.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
      "January 2024",
    isVerified: !!userData.isVerified,
  };

  return serializeFirestore(profile);
}

export async function updateWorkerProfile(uid: string, profileData: any) {
  if (!uid) throw new Error("UID is required");

  await adminDb.collection("users").doc(uid).update({
    ...profileData,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function getWorkerApplications(uid: string) {
  if (!uid) throw new Error("UID is required");
  const snap = await adminDb.collection("jobApplications")
    .where("workerId", "==", uid)
    .orderBy("createdAt", "desc")
    .get();

  const applications = await Promise.all(snap.docs.map(async (doc) => {
    const appData = doc.data();
    const jobSnap = await adminDb.collection("jobs").doc(appData.jobId).get();
    const jobData = jobSnap.data();

    return {
      id: doc.id,
      ...appData,
      jobTitle: jobData?.title || "Unknown Job",
      jobWage: jobData?.wage || 0,
      jobDuration: jobData?.duration || "",
      jobLocation: typeof jobData?.location === 'string' ? jobData.location : (jobData?.location?.address || 'Gurgaon, Haryana'),
      employerId: jobData?.employerId || ""
    };
  }));

  return serializeFirestore(applications);
}
