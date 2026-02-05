import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { z } from "zod";

const JobInputSchema = z.object({
  title: z.string().min(10).max(50),
  skill: z.enum([
    "labour",
    "mason",
    "carpenter",
    "plumber",
    "electrician",
    "painter",
  ]),
  wage: z.number().min(100).max(5000),
  duration: z.enum(["4hours", "8hours", "fullday", "halfday"]),
  description: z.string().max(500).optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export type JobInput = z.infer<typeof JobInputSchema>;

export async function createJob(data: JobInput) {
  const parsed = JobInputSchema.parse(data);
  return addDoc(collection(db, "jobs"), {
    ...parsed,
    createdAt: serverTimestamp(),
  });
}
