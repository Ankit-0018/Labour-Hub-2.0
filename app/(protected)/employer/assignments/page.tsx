import { getCurrentUser } from "@/lib/utils/auth";
import { getEmployerAssignments } from "@/lib/queries/assignments";
import AssignmentsClient from "./AssignmentsClient";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user?.uid) redirect("/auth");

  const assignments = await getEmployerAssignments(user.uid);

  return <AssignmentsClient assignments={assignments} />;
}
