export type EmployerDashboardStats = {
  activeJobsCount: number;
  applicationsCount: number;
  completedJobsCount: number;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  skillsRequired: Array<string>;
  wage: number;
  duration: string;
  employerId: any;
  status: "open" | "assigned" | "completed" | "cancelled";
};


export type WorkerStatus = "available" | "busy" | "offline";