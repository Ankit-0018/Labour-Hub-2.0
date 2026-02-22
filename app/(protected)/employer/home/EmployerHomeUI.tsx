"use client";
import { Plus, Users, CheckCircle } from "lucide-react";
import Link from "next/link";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import { Button } from "@/components/ui/button";
import { EmployerDashboardStats, Job } from "@/lib/types/employer";
import { completeJobAction } from "@/lib/server/actions";
import { useRouter } from "next/navigation";

type Props = {
  stats: EmployerDashboardStats;
  activeJobs: any[];
};

const EmployerHomeUI = ({ stats, activeJobs }: Props) => {
  const router = useRouter();

  const handleComplete = async (jobId: string) => {
    try {
      if (!confirm("क्या आप इस काम को पूरा चिन्हित करना चाहते हैं? / Mark this job as completed?")) return;
      const res = await completeJobAction(jobId);
      if (res.success) {
        alert("काम पूरा हुआ! / Job completed!");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert("Error completing job");
    }
  };
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
          <Link href="/employer/jobs" className="contents">
            <Stat
              value={stats.activeJobsCount}
              label="सक्रिय काम / Active Jobs"
              color="text-blue-600"
            />
          </Link>
          <Link href="/employer/applications" className="contents">
            <Stat
              value={stats.applicationsCount}
              label="आवेदन / Applications"
              color="text-green-600"
            />
          </Link>
          <Link href="/employer/jobs?tab=completed" className="contents">
            <Stat
              value={stats.completedJobsCount}
              label="पूरा काम / Completed"
              color="text-purple-600"
            />
          </Link>
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">
              आपकी सक्रिय नौकरियाँ / Your Active Jobs
            </h3>
            <Link href="/employer/jobs">
              <Button variant="link" size="sm" className="text-blue-600 font-bold p-0">View All →</Button>
            </Link>
          </div>

          {activeJobs.map((job: any) => (
            <div key={job.id} className="border rounded-lg p-4 mb-3 bg-white shadow-sm">
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{job.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1">{job.description}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block ${job.status === 'assigned' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {job.status === 'assigned' ? 'नियुक्त / Assigned' : 'खुला / Open'}
                  </span>
                </div>

                <div className="text-right">
                  <p className="font-bold text-green-600">₹{job.wage}</p>
                  <p className="text-xs text-gray-600">{job.duration}</p>
                </div>
              </div>

              {job.assignment && (
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <Link href={`/employer/worker/${job.assignment.workerId}`} className="flex items-center gap-2 hover:opacity-80 transition">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-sm">👨‍🔧</div>
                    <div>
                      <p className="text-xs font-semibold">{job.assignment.workerName}</p>
                      <p className="text-[10px] text-gray-500">{job.assignment.workerSkill}</p>
                    </div>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => handleComplete(job.id)}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    पूरा हुआ / Complete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recent Hires */}
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h3 className="text-lg font-bold mb-4">हाल के काम / Recent Hires</h3>

          {stats.recentHires && stats.recentHires.length > 0 ? (
            stats.recentHires.map((hire) => (
              <Link
                href={`/employer/worker/${hire.workerId}`}
                key={hire.id}
                className="border rounded-lg p-4 flex justify-between mb-3 hover:bg-gray-50 transition"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    👨‍🔧
                  </div>
                  <div>
                    <p className="font-semibold">{hire.workerName}</p>
                    <p className="text-xs text-gray-600">{hire.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">⭐ {hire.rating}</p>
                  <p className="text-xs text-gray-600">
                    {hire.reviewsCount} reviews
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              कोई हालिया नियुक्ति नहीं / No recent hires
            </p>
          )}
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
