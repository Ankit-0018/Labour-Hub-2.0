import { getCurrentUser } from "@/lib/utils/auth";
import { getEmployerDashboard } from "@/lib/queries/dashboard";
import EmployerHomeUI from "./EmployerHomeUI";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user?.uid) {
    redirect("/auth");
  }

  const dashboardData = await getEmployerDashboard(user.uid);

  return <EmployerHomeUI data={dashboardData} />;
}
