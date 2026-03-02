import { getWorkerDashboardData } from "@/lib/services/worker";
import WorkerHomeUI from "./WorkerHomeUI";
import { useUserStore } from "@/lib/stores/useUserStore";
const Page = async () =>  {
  const {user,location} = useUserStore.getState();

  const data = await getWorkerDashboardData(user?.uid || "",location?.lat || 0,location?.lng || 0,location?.address || "");
  return <WorkerHomeUI data={data}/>;

}

export default Page;

