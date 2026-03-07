"use server";

import { adminDb } from "@/lib/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { prepareLocation } from "../queries/preparelocation";

const JobInputSchema = z.object({
  title: z.string().min(3).max(50),

  skillsRequired: z.array(
    z.enum([
      "labour",
      "mason",
      "carpenter",
      "plumber",
      "electrician",
      "painter",
    ]),
  ),

  wage: z.number().min(100).max(5000),

  duration: z.enum(["4hours", "8hours", "fullday", "halfday"]),

  description: z.string().max(500).optional(),

  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export type JobInput = z.infer<typeof JobInputSchema>;

//create a job
export async function createJob(data: JobInput, employerUid: string) {
  const parsed = JobInputSchema.parse(data);

  const latNum = Number(parsed.location.lat);
  const lngNum = Number(parsed.location.lng);

  // Prepare full geo data
  const location = await prepareLocation(latNum, lngNum);

  const docRef = await adminDb.collection("jobs").add({
    title: parsed.title,
    skillsRequired: parsed.skillsRequired,
    wage: parsed.wage,
    duration: parsed.duration,
    description: parsed.description ?? "",
    status: "open",
    employerId: employerUid,
    createdAt: FieldValue.serverTimestamp(),
    location, // contains lat, lng, address, city, geohash
  });

  return { id: docRef.id };
}

export async function applyToJob(
  jobId: string,
  employerId: string,
  workerId: string,
) {
  try {
    // Query by workerId only to avoid composite index requirement
    const existingSnap = await adminDb
      .collection("jobs_applications")
      .where("workerId", "==", workerId)
      .get();

    // Check if worker already applied to this job doing in-memory filter
    const hasApplied = existingSnap.docs.some(doc => doc.data().jobId === jobId);

    if (hasApplied) {
      throw new Error("You have already applied to this job");
    }

    const docRef = await adminDb.collection("jobs_applications").add({
      jobId,
      employerId: employerId || "unknown", // Prevent undefined crash
      workerId,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });

    return { id: docRef.id };
  } catch (error: any) {
    console.error("Error in applyToJob:", error);
    throw new Error(error.message || "Failed to apply to job");
  }
}

// delete a job
export async function deleteJob(jobId: string, employerUid: string) {
  const jobRef = adminDb.collection("jobs").doc(jobId);
  const jobSnap = await jobRef.get();

  if (!jobSnap.exists) {
    throw new Error("Job not found");
  }

  const job = jobSnap.data();

  // verify employer ownership
  if (job?.employerId !== employerUid) {
    throw new Error("Unauthorized");
  }

  // prevent deleting active or closed jobs
  if (job?.status !== "open") {
    throw new Error("Job cannot be deleted");
  }

  await jobRef.update({
    status: "deleted",
    deletedAt: FieldValue.serverTimestamp(),
  });
}
