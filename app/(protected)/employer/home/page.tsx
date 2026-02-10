"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import { Skeleton } from "@/components/ui/skeleton";

function EmployerHomeSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 p-4">
      <Skeleton className="h-6 w-40 mb-3" />
      <Skeleton className="h-4 w-64 mb-6" />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>

      <Skeleton className="h-40" />
    </div>
  );
}

export default function EmployerHomePage() {
  const [loading] = useState(false);
  const [jobApplications] = useState([3, 5, 2]);

  if (loading) return <EmployerHomeSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
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
          <h2 className="text-xl font-bold mb-2">
            स्वागत है / Welcome Back
          </h2>
          <p className="text-gray-600">
            यहाँ आप मजदूरों को काम देने के लिए नौकरियाँ पोस्ट कर सकते हैं।
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Stat value="5" label="सक्रिय काम / Active Jobs" color="text-blue-600" />
          <Stat value="12" label="आवेदन / Applications" color="text-green-600" />
          <Stat value="8" label="पूरा काम / Completed" color="text-purple-600" />
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

          {[1, 2, 3].map((job) => (
            <div key={job} className="border rounded-lg p-4 mb-3">
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="font-semibold">
                    {job === 1
                      ? "विद्युत मरम्मत / Electrical Repair"
                      : job === 2
                      ? "वायरिंग स्थापन / Wiring Installation"
                      : "पैनल सेटअप / Panel Setup"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {job === 1
                      ? "ABC Building"
                      : job === 2
                      ? "XYZ Corp"
                      : "City Services"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-green-600">₹1200 - ₹1800</p>
                  <p className="text-xs text-gray-600">
                    {job === 1 ? "Full Day" : job === 2 ? "8 Hours" : "4 Hours"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 text-sm text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job === 1 ? "0.5 km" : job === 2 ? "1.2 km" : "2.1 km"}
                </span>

                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {jobApplications[job - 1]} आवेदन
                </span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  आवेदन देखें
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  संपादित करें
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Hires */}
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h3 className="text-lg font-bold mb-4">
            हाल के काम / Recent Hires
          </h3>

          {[1, 2].map((hire) => (
            <div key={hire} className="border rounded-lg p-4 flex justify-between mb-3">
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
}

function Stat({
  value,
  label,
  color,
}: {
  value: string;
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
      className={`bg-gradient-to-br ${color} text-white rounded-2xl p-6 hover:shadow-lg transition`}
    >
      {icon}
      <h3 className="text-lg font-bold mt-2">{title}</h3>
      <p className="text-sm opacity-90">{subtitle}</p>
    </div>
  );
}
