"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import LocationField from "@/components/sections/location-field";

const SKILLS = [
  { id: "labour", label: "Labour / लेबर" },
  { id: "mason", label: "Mason / मिस्त्री" },
  { id: "carpenter", label: "Carpenter / बढ़ई" },
  { id: "plumber", label: "Plumber / प्लंबर" },
  { id: "electrician", label: "Electrician / इलेक्ट्रीशियन" },
  { id: "painter", label: "Painter / पेंटर" },
];

const DURATIONS = [
  { id: "4hours", label: "4 घंटे / 4 Hours" },
  { id: "8hours", label: "8 घंटे / 8 Hours" },
  { id: "fullday", label: "पूरा दिन / Full Day" },
  { id: "halfday", label: "आधा दिन / Half Day" },
];

export default function PostJobPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    skill: "",
    wage: "",
    duration: "",
    description: "",
    location: "Sector 5, Gurgaon",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.skill || !formData.wage) {
      alert("कृपया सभी आवश्यक फील्ड भरें / Please fill all required fields");
      return;
    }

    console.log("Job posted:", formData);
    alert("नौकरी पोस्ट की गई / Job posted successfully!");
    router.push("/employer/home");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-blue-600 text-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/employer/home">
            <ChevronLeft className="w-6 h-6 cursor-pointer" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">नई नौकरी पोस्ट करें</h1>
            <p className="text-sm text-blue-100">Post a new job</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                काम का नाम / Job Title *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="जैसे: विद्युत मरम्मत"
                required
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                आवश्यक कौशल / Skill Required *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SKILLS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, skill: s.id }))
                    }
                    className={`p-3 rounded-lg border-2 text-sm font-medium ${
                      formData.skill === s.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                अवधि / Duration
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, duration: d.id }))
                    }
                    className={`p-3 rounded-lg border-2 text-sm font-medium ${
                      formData.duration === d.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wage */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                मजदूरी / Wage (₹) *
              </label>
              <Input
                type="number"
                name="wage"
                value={formData.wage}
                onChange={handleChange}
                required
              />
            </div>

            {/* Location */}
            <div>
  <label className="block text-sm font-semibold text-gray-900 mb-2">
    स्थान / Location
  </label>

  <LocationField />
</div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                विवरण / Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Submit */}
            <Button className="w-full bg-blue-600 h-12">
              नौकरी पोस्ट करें / Post Job
            </Button>

            <Link href="/employer/home">
              <Button variant="outline" className="w-full bg-transparent">
                रद्द करें / Cancel
              </Button>
            </Link>
          </form>
        </div>
      </div>

      <EmployerNav />
    </div>
  );
}
