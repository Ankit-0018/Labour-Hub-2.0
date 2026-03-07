"use server";

import { adminDb } from "@/lib/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { DATABASE } from "@/lib/constants/db";

export async function acceptApplication(applicationId: string) {
  const applicationRef = adminDb
    .collection(DATABASE.JOBS_APPLICATIONS_COLLECTION)
    .doc(applicationId);

  await adminDb.runTransaction(async (transaction) => {
    const applicationSnap = await transaction.get(applicationRef);

    if (!applicationSnap.exists) {
      throw new Error("Application not found");
    }

    const application = applicationSnap.data();

    if (application?.status !== "pending") {
      throw new Error("Application already processed");
    }

    const assignmentRef = adminDb
      .collection(DATABASE.JOBS_ASSIGNMENTS_COLLECTION)
      .doc();

    const jobRef = adminDb
      .collection(DATABASE.JOBS_COLLECTION)
      .doc(application.jobId);

    const jobSnap = await transaction.get(jobRef);
    const jobData = jobSnap.data();

    transaction.update(applicationRef, {
      status: "accepted",
      updatedAt: FieldValue.serverTimestamp(),
    });

    transaction.set(assignmentRef, {
      jobId: application.jobId,
      workerId: application.workerId,
      employerId: application.employerId,
      wage: jobData?.wage || 0,
      jobTitle: jobData?.title || "Unknown Job",
      status: "active",
      assignedAt: FieldValue.serverTimestamp(),
    });

    transaction.update(jobRef, {
      status: "closed",
    });
  });
}
/**
 * Reject job application
 */
export async function rejectApplication(applicationId: string) {
  const applicationRef = adminDb
    .collection(DATABASE.JOBS_APPLICATIONS_COLLECTION)
    .doc(applicationId);

  const applicationSnap = await applicationRef.get();

  if (!applicationSnap.exists) {
    throw new Error("Application not found");
  }

  const application = applicationSnap.data();

  if (application?.status !== "pending") {
    throw new Error("Application already processed");
  }

  await applicationRef.update({
    status: "rejected",
    updatedAt: FieldValue.serverTimestamp(),
  });
}
