import { getCurrentUser } from "@/lib/utils/auth";
import { getEmployerJobs } from "@/lib/queries/jobs";
import MyJobsClient from "./MyJobsClient";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user?.uid) {
    redirect("/auth");
  }

  const jobs = await getEmployerJobs(user.uid);

  return <MyJobsClient jobs={jobs} />;
}
