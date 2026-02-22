"use server";

import { adminDb } from "@/lib/firebase/firebase-admin";
import { getCurrentUserId } from "./auth";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

/**
 * Employer: Post a new job
 */
export async function createJobAction(formData: {
    title: string;
    skill: string;
    wage: number;
    duration: string;
    description?: string;
    location: { lat: number; lng: number };
    photoUrl?: string;
}) {
    const uid = await getCurrentUserId();

    const jobData = {
        title: formData.title,
        skill: formData.skill,
        wage: Number(formData.wage),
        duration: formData.duration,
        description: formData.description || "",
        location: formData.location,
        employerId: uid,
        status: "open",
        photoUrl: formData.photoUrl || `https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=500&auto=format&fit=crop`,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection("jobs").add(jobData);

    revalidatePath("/employer/home");
    revalidatePath("/worker/home");
    revalidatePath("/worker/search");
    return { success: true, id: docRef.id };
}

/**
 * Worker: Update availability status
 */
export async function updateWorkerStatusAction(status: "available" | "busy" | "offline") {
    const uid = await getCurrentUserId();

    await adminDb.collection("users").doc(uid).update({
        "workerProfile.workStatus": status,
        updatedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath("/worker/home");
    return { success: true };
}

/**
 * Worker: Apply for a job
 */
export async function applyToJobAction(jobId: string) {
    const uid = await getCurrentUserId();

    // Check if job exists and is open
    const jobDoc = await adminDb.collection("jobs").doc(jobId).get();
    if (!jobDoc.exists || jobDoc.data()?.status !== "open") {
        throw new Error("Job is no longer available");
    }

    const jobData = jobDoc.data();

    // Check if worker already applied
    const existingApp = await adminDb.collection("jobApplications")
        .where("jobId", "==", jobId)
        .where("workerId", "==", uid)
        .get();

    if (!existingApp.empty) {
        throw new Error("You have already applied for this job");
    }

    // Create application
    const appData = {
        jobId,
        workerId: uid,
        employerId: jobData?.employerId,
        status: "pending",
        createdAt: FieldValue.serverTimestamp(),
    };

    await adminDb.collection("jobApplications").add(appData);

    revalidatePath("/worker/search");
    revalidatePath("/worker/home");

    return { success: true };
}

/**
 * Worker: Get all open jobs
 */
export async function getOpenJobsAction() {
    const { getOpenJobs } = await import("./worker");
    return await getOpenJobs();
}

/**
 * Worker: Get application for a specific job
 */
export async function getWorkerApplicationsAction() {
    const uid = await getCurrentUserId();
    const { getWorkerApplications } = await import("./worker");
    return await getWorkerApplications(uid);
}

/**
 * Worker: Get earnings data
 */
export async function getWorkerEarningsAction() {
    const uid = await getCurrentUserId();
    const { getWorkerEarningsData } = await import("./worker");
    return await getWorkerEarningsData(uid);
}

/**
 * Worker: Get profile data
 */
export async function getWorkerProfileAction() {
    const uid = await getCurrentUserId();
    const { getWorkerProfileData } = await import("./worker");
    return await getWorkerProfileData(uid);
}

/**
 * Worker: Update profile data
 */
export async function updateWorkerProfileAction(data: any) {
    const uid = await getCurrentUserId();
    const { updateWorkerProfile } = await import("./worker");
    await updateWorkerProfile(uid, data);
    revalidatePath("/worker/profile");
    return { success: true };
}

/**
 * Employer: Get pending applications
 */
export async function getEmployerApplicationsAction() {
    const uid = await getCurrentUserId();
    const { getEmployerApplications } = await import("./employer");
    return await getEmployerApplications(uid);
}

/**
 * Employer: Get active jobs
 */
export async function getEmployerActiveJobsAction() {
    const uid = await getCurrentUserId();
    const { getEmployerActiveJobs } = await import("./employer");
    return await getEmployerActiveJobs(uid);
}

/**
 * Employer: Get completed jobs
 */
export async function getEmployerCompletedJobsAction() {
    const uid = await getCurrentUserId();
    const { getEmployerCompletedJobs } = await import("./employer");
    return await getEmployerCompletedJobs(uid);
}

/**
 * Employer: Hire a worker (Accept application)
 */
export async function hireWorkerAction(application: any) {
    const uid = await getCurrentUserId();
    const { hireWorker } = await import("./employer");
    await hireWorker(uid, application);
    revalidatePath("/employer/home");
    revalidatePath("/employer/applications");
    return { success: true };
}

/**
 * Employer: Complete a job
 */
export async function completeJobAction(jobId: string) {
    const uid = await getCurrentUserId();
    const { completeJob } = await import("./employer");
    await completeJob(uid, jobId);
    revalidatePath("/employer/home");
    revalidatePath("/worker/home");
    return { success: true };
}

/**
 * Worker: Get a specific job by ID
 */
export async function getJobByIdAction(jobId: string) {
    const { getJobById } = await import("./worker");
    return await getJobById(jobId);
}

/**
 * Employer: Reject an application
 */
export async function rejectApplicationAction(applicationId: string) {
    const uid = await getCurrentUserId();
    const { rejectApplication } = await import("./employer");
    await rejectApplication(uid, applicationId);
    revalidatePath("/employer/applications");
    return { success: true };
}

/**
 * Employer: Get a worker's public profile
 */
export async function getWorkerPublicProfileAction(workerId: string) {
    const { getWorkerProfileData } = await import("./worker");
    return await getWorkerProfileData(workerId);
}

/**
 * Employer: Get profile data
 */
export async function getEmployerProfileAction() {
    const uid = await getCurrentUserId();
    const { getEmployerProfileData } = await import("./employer");
    return await getEmployerProfileData(uid);
}
