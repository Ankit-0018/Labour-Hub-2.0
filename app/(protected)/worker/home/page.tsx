import { getWorkerDashboard } from "@/lib/queries/dashboard";
import WorkerHomeUI from "./WorkerHomeUI";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/utils/auth";

const Page = async () => {
  // We can't access client state (useUserStore) from a server component.
  // Worker home fetches dashboard data on client side using the store's user/location.
  return <WorkerHomeUI />;
};

export default Page;
