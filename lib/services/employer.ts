import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { z } from "zod";
import { prepareLocation } from "../server/preparelocation";

const JobInputSchema = z.object({
  title: z.string().min(10).max(50),

  skillsRequired: z.array(
    z.enum([
      "labour",
      "mason",
      "carpenter",
      "plumber",
      "electrician",
      "painter",
    ])
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

  return addDoc(collection(db, "jobs"), {
    title: parsed.title,
    skillsRequired: parsed.skillsRequired,
    wage: parsed.wage,
    duration: parsed.duration,
    description: parsed.description ?? "",
    status: "open",
    employerId: employerUid,
    createdAt: serverTimestamp(),
    location, // contains lat, lng, address, city, geohash
  });
}

//get all my job postings
export const getEmployerJobs = async (employerId: string) => {
  const q = query(
    collection(db, "jobs"),
    where("employerId", "==", employerId)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

//get my jobs posting by status
export const getEmployerJobsByStatus = async (
  employerId: string,
  status: "open" | "closed"
) => {
  const q = query(
    collection(db, "jobs"),
    where("employerId", "==", employerId),
    where("status", "==", status)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};


//get jobs application by jobId
export const getApplicationsForJob = async (jobId: string) => {
  const q = query(
    collection(db, "jobApplications"),
    where("jobId", "==", jobId)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

//accept the job application
export const acceptApplication = async (
  applicationId: string,
  jobId: string,
  employerId: string,
  workerId: string
) => {

  //Update application
  await updateDoc(doc(db, "jobApplications", applicationId), {
    status: "accepted",
  });

  //Create assignment
  await addDoc(collection(db, "jobAssignments"), {
    jobId,
    employerId,
    workerId,
    status: "pending", // pending | completed | disputed
    assignedAt: serverTimestamp(),
  });

  //Close job
  await updateDoc(doc(db, "jobs", jobId), {
    status: "closed",
  });
};


//get all the contracts
export const getEmployerAssignments = async (employerId: string) => {
  const q = query(
    collection(db, "jobAssignments"),
    where("employerId", "==", employerId)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

//get all the contracts by status
export const getEmployerAssignmentsByStatus = async (
  employerId: string,
  status: "pending" | "completed" | "disputed"
) => {
  const q = query(
    collection(db, "jobAssignments"),
    where("employerId", "==", employerId),
    where("status", "==", status)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getWorkerProfile = async (workerId: string) => {
  const snap = await getDoc(doc(db, "users", workerId));

  if (!snap.exists()) throw new Error("Worker not found");

  return {
    id: snap.id,
    ...snap.data(),
  };
};