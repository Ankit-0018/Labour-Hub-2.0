import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { z } from "zod";

const JobInputSchema = z.object({
  title: z.string().min(10).max(50),

  skillsRequired: z.array(
    z.enum(["electrician", "plumber", "carpenter", "painter"])
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

export async function createJob(data: JobInput, employerUid: string) {
  const parsed = JobInputSchema.parse(data);

  return addDoc(collection(db, "jobs"), {
    ...parsed,
    status: "open",
    employerId: employerUid, // store UID only
    createdAt: serverTimestamp(),
  });
}