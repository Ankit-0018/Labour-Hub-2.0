import { adminDb } from "@/lib/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { serializeFirestore } from "@/lib/utils/firebase/serializeFirestore";

export async function getEmployerDashboard(uid: string) {
  if (!uid) throw new Error("UID is required");

  // Active jobs: status is 'open' or 'assigned'
  const activeJobsQuery = adminDb.collection("jobs")
    .where("employerId", "==", uid)
    .where("status", "in", ["open", "assigned"]);

  // Applications count
  const appsQuery = adminDb.collection("jobApplications")
    .where("employerId", "==", uid);

  // Completed jobs
  const completedQuery = adminDb.collection("jobAssignments")
    .where("employerId", "==", uid)
    .where("status", "==", "completed");

  const [activeSnap, appsSnap, completedSnap, recentHiresSnap] = await Promise.all([
    activeJobsQuery.get(),
    appsQuery.get(),
    completedQuery.get(),
    adminDb.collection("jobAssignments")
      .where("employerId", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get()
  ]);

  const recentHires = await Promise.all(recentHiresSnap.docs.map(async (assignmentDoc) => {
    const assignmentData = assignmentDoc.data();
    const workerSnap = await adminDb.collection("users").doc(assignmentData.workerId).get();
    const workerData = workerSnap.data();

    return {
      id: assignmentDoc.id,
      workerId: assignmentData.workerId,
      workerName: workerData?.name || "Unknown Worker",
      role: workerData?.workerProfile?.skills?.[0] || "General Labour",
      rating: workerData?.workerProfile?.ratingAverage || 0,
      reviewsCount: workerData?.workerProfile?.ratingCount || 0,
      status: assignmentData.status,
    };
  }));

  return serializeFirestore({
    activeJobsCount: activeSnap.size,
    applicationsCount: appsSnap.size,
    completedJobsCount: completedSnap.size,
    recentHires,
  });
}

export async function getEmployerApplications(uid: string) {
  if (!uid) throw new Error("UID is required");

  // Fetch all applications for jobs owned by this employer
  const snap = await adminDb.collection("jobApplications")
    .where("employerId", "==", uid)
    .where("status", "==", "pending")
    .get();

  const applications = await Promise.all(snap.docs.map(async (doc) => {
    const data = doc.data();
    const [workerSnap, jobSnap] = await Promise.all([
      adminDb.collection("users").doc(data.workerId).get(),
      adminDb.collection("jobs").doc(data.jobId).get(),
    ]);

    const workerData = workerSnap.data();
    const jobData = jobSnap.data();

    return {
      id: doc.id,
      jobId: data.jobId,
      jobTitle: jobData?.title || "Unknown Job",
      workerId: data.workerId,
      workerName: workerData?.name || "Unknown Worker",
      workerSkill: workerData?.workerProfile?.skills?.[0] || "General",
      workerRating: workerData?.workerProfile?.ratingAverage || 0,
      appliedAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      wage: jobData?.wage || 0,
    };
  }));

  return serializeFirestore(applications);
}

export async function hireWorker(employerUid: string, application: any) {
  const batch = adminDb.batch();

  // 1. Create Assignment
  const assignmentRef = adminDb.collection("jobAssignments").doc();
  batch.set(assignmentRef, {
    jobId: application.jobId,
    workerId: application.workerId,
    employerId: employerUid,
    status: "active",
    wage: application.wage,
    title: application.jobTitle,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  // 2. Update Job Status
  const jobRef = adminDb.collection("jobs").doc(application.jobId);
  batch.update(jobRef, {
    status: "assigned",
    assignedTo: application.workerId,
    updatedAt: FieldValue.serverTimestamp(),
  });

  // 3. Update Application Status
  const appRef = adminDb.collection("jobApplications").doc(application.id);
  batch.update(appRef, {
    status: "accepted",
    updatedAt: FieldValue.serverTimestamp(),
  });

  // 4. Reject other applications for the same job (optional but good)
  const otherAppsSnap = await adminDb.collection("jobApplications")
    .where("jobId", "==", application.jobId)
    .where("status", "==", "pending")
    .get();

  otherAppsSnap.forEach(doc => {
    if (doc.id !== application.id) {
      batch.update(doc.ref, {
        status: "rejected",
        updatedAt: FieldValue.serverTimestamp()
      });
    }
  });

  await batch.commit();
}

export async function getEmployerActiveJobs(uid: string): Promise<any[]> {
  if (!uid) throw new Error("UID is required");
  const snap = await adminDb.collection("jobs")
    .where("employerId", "==", uid)
    .where("status", "in", ["open", "assigned"])
    .orderBy("createdAt", "desc")
    .get();

  const jobs = await Promise.all(snap.docs.map(async (doc) => {
    const data = doc.data();
    let assignment = null;

    if (data.status === "assigned" && data.assignedTo) {
      const workerSnap = await adminDb.collection("users").doc(data.assignedTo).get();
      const workerData = workerSnap.data();
      assignment = {
        workerId: data.assignedTo,
        workerName: workerData?.name || "Unknown Worker",
        workerSkill: workerData?.workerProfile?.skills?.[0] || "General",
        workerRating: workerData?.workerProfile?.ratingAverage || 0,
      };
    }

    return {
      id: doc.id,
      title: data.title || "Untitled Job",
      description: data.description || "",
      skillsRequired: [data.skill], // Normalizing to same structure
      wage: Number(data.wage) || 0,
      duration: data.duration || "",
      employerId: data.employerId || uid,
      status: data.status || "open",
      assignment,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      location: data.location,
    };
  }));

  return serializeFirestore(jobs);
}

export async function getEmployerCompletedJobs(uid: string): Promise<any[]> {
  if (!uid) throw new Error("UID is required");
  const snap = await adminDb.collection("jobs")
    .where("employerId", "==", uid)
    .where("status", "==", "completed")
    .orderBy("createdAt", "desc")
    .get();

  const jobs = await Promise.all(snap.docs.map(async (doc) => {
    const data = doc.data();
    let assignment = null;

    if (data.assignedTo) {
      const workerSnap = await adminDb.collection("users").doc(data.assignedTo).get();
      const workerData = workerSnap.data();
      assignment = {
        workerId: data.assignedTo,
        workerName: workerData?.name || "Unknown Worker",
        workerSkill: workerData?.workerProfile?.skills?.[0] || "General",
      };
    }

    return {
      id: doc.id,
      title: data.title || "Untitled Job",
      wage: Number(data.wage) || 0,
      duration: data.duration || "",
      status: data.status,
      assignment,
      completedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };
  }));

  return serializeFirestore(jobs);
}

export async function completeJob(employerUid: string, jobId: string) {
  const batch = adminDb.batch();
  const now = FieldValue.serverTimestamp();

  // 1. Update Job
  const jobRef = adminDb.collection("jobs").doc(jobId);
  batch.update(jobRef, {
    status: "completed",
    updatedAt: now,
  });

  // 2. Update Assignment
  const assignmentsSnap = await adminDb.collection("jobAssignments")
    .where("jobId", "==", jobId)
    .where("status", "==", "active")
    .get();

  assignmentsSnap.forEach(doc => {
    batch.update(doc.ref, {
      status: "completed",
      completedAt: now,
      updatedAt: now,
    });
  });

  await batch.commit();
}

export async function rejectApplication(employerUid: string, applicationId: string) {
  if (!employerUid) throw new Error("Employer UID is required");

  await adminDb.collection("jobApplications").doc(applicationId).update({
    status: "rejected",
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function getEmployerProfileData(uid: string) {
  if (!uid) throw new Error("UID is required");

  const userSnap = await adminDb.collection("users").doc(uid).get();
  const userData = userSnap.data();

  if (!userData) throw new Error("User not found");

  // Fetch stats separately or use counts from profile
  // For now, mirroring the profile structure
  const profile = {
    name: userData.name || "Employer Name",
    phone: userData.phone || "Not set",
    email: userData.email || "Not set",
    location: userData.location?.latitude ?
      "Sector 5, Gurgaon" :
      (typeof userData.location === 'string' ? userData.location : "Sector 5, Gurgaon"),
    companyName: userData.companyName || "My Company",
    businessType: userData.businessType || "Construction",
    rating: userData.rating || 4.5,
    reviews: userData.reviews || 32,
    jobsPosted: userData.jobsPosted || 0,
    activeJobs: userData.activeJobs || 0,
    memberSince: userData.createdAt?.toDate ?
      userData.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
      "January 2024",
    isVerified: !!userData.isVerified,
  };

  return serializeFirestore(profile);
}
