import { getEmployerDashboard, getEmployerActiveJobs } from "@/lib/server/employer";
import EmployerHomeUI from "./EmployerHomeUI";
import { getCurrentUserId } from "@/lib/server/auth";

export default async function Page() {
  const uid = await getCurrentUserId();

  const [stats, activeJobs] = await Promise.all([
    getEmployerDashboard(uid),
    getEmployerActiveJobs(uid),
  ]);

  return <EmployerHomeUI stats={stats} activeJobs={activeJobs} />;
}
