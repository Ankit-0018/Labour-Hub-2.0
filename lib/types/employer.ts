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
  employerId: string;
  status: "open" | "assigned" | "completed" | "cancelled";
};
