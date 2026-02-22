export type EmployerDashboardStats = {
  activeJobsCount: number;
  applicationsCount: number;
  completedJobsCount: number;
  recentHires?: Array<{
    id: string;
    workerId: string;
    workerName: string;
    role: string;
    rating: number;
    reviewsCount: number;
    status: string;
  }>;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  skillsRequired: Array<string>;
  wage: number;
  duration: string;
  employerId: string;
  status: "open" | "assigned" | "completed" | "cancelled";
};
