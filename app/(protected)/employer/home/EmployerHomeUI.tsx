import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import { EmployerDashboardStats, Job } from "@/lib/types";
type Props = {
  stats: EmployerDashboardStats;
  activeJobs: Job[];
};

const EmployerHomeUI = ({ stats, activeJobs } : Props) => {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-blue-600 text-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Labour Hub</h1>
          <p className="text-sm text-blue-100">नियोक्ता / Employer</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome */}
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h2 className="text-xl font-bold mb-2">स्वागत है / Welcome Back</h2>
          <p className="text-gray-600">
            यहाँ आप मजदूरों को काम देने के लिए नौकरियाँ पोस्ट कर सकते हैं।
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Stat
            value={stats.activeJobsCount}
            label="सक्रिय काम / Active Jobs"
            color="text-blue-600"
          />
          <Stat
            value={stats.applicationsCount}
            label="आवेदन / Applications"
            color="text-green-600"
          />
          <Stat
            value={stats.completedJobsCount}
            label="पूरा काम / Completed"
            color="text-purple-600"
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/employer/post-job">
            <ActionCard
              icon={<Plus className="w-10 h-10" />}
              title="नई नौकरी पोस्ट करें"
              subtitle="Post a new job"
              color="from-blue-600 to-blue-700"
            />
          </Link>

          <Link href="/employer/search-workers">
            <ActionCard
              icon={<Users className="w-10 h-10" />}
              title="मजदूर खोजें"
              subtitle="Search workers"
              color="from-green-600 to-green-700"
            />
          </Link>
        </div>

        {/* Active Jobs */}
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h3 className="text-lg font-bold mb-4">
            आपकी सक्रिय नौकरियाँ / Your Active Jobs
          </h3>

          {activeJobs.map((job: any) => (
            <div key={job.id} className="border rounded-lg p-4 mb-3">
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.description}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-green-600">₹{job.wage}</p>
                  <p className="text-xs text-gray-600">{job.duration}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Hires */}
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h3 className="text-lg font-bold mb-4">हाल के काम / Recent Hires</h3>

          {[1, 2].map((hire) => (
            <div
              key={hire}
              className="border rounded-lg p-4 flex justify-between mb-3"
            >
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  👨‍🔧
                </div>
                <div>
                  <p className="font-semibold">
                    {hire === 1 ? "Rajesh Kumar" : "Amit Singh"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {hire === 1
                      ? "Electrician / इलेक्ट्रीशियन"
                      : "Mason / मिस्त्री"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">⭐ 4.8</p>
                <p className="text-xs text-gray-600">
                  {hire === 1 ? "45 reviews" : "32 reviews"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EmployerNav />
    </div>
  );
};

export default EmployerHomeUI;

function Stat({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div
      className={`bg-linear-to-br ${color} text-white rounded-2xl p-6 hover:shadow-lg transition`}
    >
      {icon}
      <h3 className="text-lg font-bold mt-2">{title}</h3>
      <p className="text-sm opacity-90">{subtitle}</p>
    </div>
  );
}
