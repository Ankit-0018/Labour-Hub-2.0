import { getJobById } from "@/lib/queries/jobs";
import JobDetailsPage from "./client";
import { getEmployerProfile } from "@/lib/queries/employer";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    return (
      <div>
        <h1>Job not found</h1>
      </div>
    );
  }

  const employer = await getEmployerProfile(job.employerId);

  return <JobDetailsPage job={job} employer={employer} />;
}
