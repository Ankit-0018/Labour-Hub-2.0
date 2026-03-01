import { addDoc, collection, doc, endAt, getDocs, orderBy, query, serverTimestamp, startAt, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { distanceBetween, geohashQueryBounds } from "geofire-common";
import { Timestamp } from "firebase/firestore";

//get all the open jobs
export const getOpenJobs = async () => {
  const q = query(
    collection(db, "jobs"),
    where("status", "==", "open")
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};


//apply to jobs
export const applyToJob = async (
  jobId: string,
  employerId: string,
  workerId: string
) => {
  return addDoc(collection(db, "jobApplications"), {
    jobId,
    employerId,
    workerId,
    status: "pending",
    createdAt: serverTimestamp(),
  });
};


//get your all job applications
export const getMyApplications = async (workerId: string) => {
  const q = query(
    collection(db, "jobApplications"),
    where("workerId", "==", workerId)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};


//get your job applications by status
export const getMyApplicationsByStatus = async (
  workerId: string,
  status: "pending" | "accepted" | "rejected"
) => {
  const q = query(
    collection(db, "jobApplications"),
    where("workerId", "==", workerId),
    where("status", "==", status)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

//get your all the assigned jobs
export const getMyAssignedJobs = async (workerId: string) => {
  const q = query(
    collection(db, "jobAssignments"),
    where("workerId", "==", workerId)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

//get your assigned jobs by status
export const getMyAssignedJobsByStatus = async (
  workerId: string,
  status: "pending" | "completed" | "disputed"
) => {
  const q = query(
    collection(db, "jobAssignments"),
    where("workerId", "==", workerId),
    where("status", "==", status)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};


//update location
export const updateWorkerLocation = async (
  workerId: string,
  lat: number,
  lng: number
) => {
  await updateDoc(doc(db, "users", workerId), {
    location: {
      lat,
      lng,
    },
    updatedAt: serverTimestamp(),
  });
};

//update availablity
export const updateWorkerAvailability = async (
  workerId: string,
  status: "available" | "busy" | "offline"
) => {
  await updateDoc(doc(db, "users", workerId), {
    availability: status,
    updatedAt: serverTimestamp(),
  });
};

//get jobs within the radius
export async function getJobsWithinRadius(
  workerLat: number,
  workerLng: number,
  city: string,
  radiusInKm: number = 3
) {
  const bounds = geohashQueryBounds(
    [workerLat, workerLng],
    radiusInKm * 1000
  );

  const promises = bounds.map((b) => {
    const q = query(
      collection(db, "jobs"),
      where("location.city", "==", city), 
      orderBy("location.geohash"),
      startAt(b[0]),
      endAt(b[1])
    );

    return getDocs(q);
  });

  const snapshots = await Promise.all(promises);

  const matchingJobs: any[] = [];

  snapshots.forEach((snap) => {
    snap.docs.forEach((doc) => {
      const job = doc.data();
      const jobLat = job.location.lat;
      const jobLng = job.location.lng;

      const distanceInKm = distanceBetween(
        [workerLat, workerLng],
        [jobLat, jobLng]
      );

      if (distanceInKm <= radiusInKm) {
        matchingJobs.push({
          id: doc.id,
          ...job,
          distance: distanceInKm,
        });
      }
    });
  });

  return matchingJobs;
}

//get worker earning in a range
export async function getEarningsInRange(
  workerId: string,
  startDate: Date,
  endDate: Date
) {
  const q = query(
    collection(db, "jobAssignments"),
    where("workerId", "==", workerId),
    where("status", "==", "completed"),
    where("completedAt", ">=", Timestamp.fromDate(startDate)),
    where("completedAt", "<=", Timestamp.fromDate(endDate))
  );

  const snapshot = await getDocs(q);

  let total = 0;

  snapshot.forEach((doc) => {
    total += doc.data().wage;
  });

  return total;
}

//get today earning 
export async function getTodayEarnings(workerId: string) {
  const now = new Date();

  // Start of today (00:00)
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  // Start of tomorrow
  const startOfTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  const q = query(
    collection(db, "jobAssignments"),
    where("workerId", "==", workerId),
    where("status", "==", "completed"),
    where("completedAt", ">=", Timestamp.fromDate(startOfToday)),
    where("completedAt", "<", Timestamp.fromDate(startOfTomorrow))
  );

  const snapshot = await getDocs(q);

  let total = 0;

  snapshot.forEach((doc) => {
    total += doc.data().wage;
  });

  return total;
}

//get completed job count
export async function getCompletedJobsCount(workerId: string) {
  const q = query(
    collection(db, "jobAssignments"),
    where("workerId", "==", workerId),
    where("status", "==", "completed")
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

//get rating
export async function getWorkerRating(workerId: string) {
  const q = query(
    collection(db, "reviews"),
    where("workerId", "==", workerId)
  );

  const snapshot = await getDocs(q);

  let total = 0;

  snapshot.forEach(doc => {
    total += doc.data().rating;
  });

  const ratingCount = snapshot.size;
  const averageRating = ratingCount > 0 ? total / ratingCount : 0;

  return { averageRating, ratingCount };
}

//profile stats
export async function getWorkerProfileStats(workerId: string) {
  const completedJobsCount = await getCompletedJobsCount(workerId);
  const { averageRating, ratingCount } =
    await getWorkerRating(workerId);

  return {
    completedJobsCount,
    averageRating: averageRating.toFixed(1),
    ratingCount,
  };
}
//get worker dashboard data
export async function getWorkerDashboardData(
  workerId: string,
  lat: number,
  lng: number,
  city: string
) {
  const nearbyJobs = await getJobsWithinRadius(lat, lng, city, 3);

  const nearbyJobsCount = nearbyJobs.length;

  const closestJobDistance =
    nearbyJobs.length > 0
      ? Math.min(...nearbyJobs.map((j) => j.distance))
      : null;

  const todayEarnings = await getTodayEarnings(workerId);
  const {averageRating, completedJobsCount, ratingCount} = await getWorkerProfileStats(workerId);
  return {
    nearbyJobsCount,
    averageRating,
    completedJobsCount,
    ratingCount,
    closestJobDistance: closestJobDistance
      ? closestJobDistance.toFixed(2)
      : "—",
    todayEarnings,
  };
}