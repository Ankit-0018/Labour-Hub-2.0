"use server"

import { adminDb } from "@/lib/firebase/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"
import { DATABASE } from "../constants/db"

/**
 * Complete assignment
 * - mark assignment completed
 * - create earning record
 */
export async function completeAssignment(assignmentId: string) {
  const assignmentRef = adminDb.collection(DATABASE.JOBS_ASSIGNMENTS_COLLECTION).doc(assignmentId)

  const assignmentSnap = await assignmentRef.get()

  if (!assignmentSnap.exists) {
    throw new Error("Assignment not found")
  }

  const assignment = assignmentSnap.data()

  if (assignment?.status !== "active") {
    throw new Error("Assignment already processed")
  }

  // update assignment status
  await assignmentRef.update({
    status: "completed",
    completedAt: FieldValue.serverTimestamp()
  })

  

  // Fallback for assignments created before wage was attached
  let amount = assignment?.wage;
  if (!amount && assignment?.jobId) {
    const jobSnap = await adminDb.collection(DATABASE.JOBS_COLLECTION).doc(assignment.jobId).get();
    amount = jobSnap.data()?.wage || 0;
  }

  // add earning for worker
  await adminDb.collection(DATABASE.EARNINGS_COLLECTION).add({
    workerId: assignment?.workerId,
    employerId: assignment?.employerId,
    jobId: assignment?.jobId,
    assignmentId,
    amount: amount || 0,
    createdAt: FieldValue.serverTimestamp()
  })
}

/**
 * Dispute assignment
 */
export async function disputeAssignment(
  assignmentId: string,
  reason: string
) {
  const assignmentRef = adminDb.collection(DATABASE.JOBS_ASSIGNMENTS_COLLECTION).doc(assignmentId)

  const assignmentSnap = await assignmentRef.get()

  if (!assignmentSnap.exists) {
    throw new Error("Assignment not found")
  }

  const assignment = assignmentSnap.data()

  if (assignment?.status !== "active") {
    throw new Error("Assignment cannot be disputed")
  }

  await assignmentRef.update({
    status: "disputed",
    disputeReason: reason,
    disputedAt: FieldValue.serverTimestamp()
  })
}