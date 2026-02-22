"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Camera } from "lucide-react";
import Link from "next/link";
import { EmployerNav } from "@/components/navigation/EmployerNav";
import LocationField from "@/components/sections/location-field";
import { createJobAction } from "@/lib/server/actions";
import { useUserStore } from "@/lib/stores/useUserStore";

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
  const location = useUserStore((s) => s.location);

  const [formData, setFormData] = useState({
    title: "",
    skill: "",
    wage: "",
    duration: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.skill ||
      !formData.wage ||
      !formData.duration
    ) {
      alert("कृपया सभी आवश्यक फील्ड भरें");
      return;
    }

    if (!location) {
      alert("कृपया स्थान चुनें / Please select location");
      return;
    }

    try {
      const res = await createJobAction({
        title: formData.title,
        skill: formData.skill,
        wage: Number(formData.wage),
        duration: formData.duration,
        description: formData.description || undefined,
        location: {
          lat: location.lat,
          lng: location.lng,
        },
      });

      if (res.success) {
        alert("नौकरी पोस्ट की गई / Job posted successfully!");
        router.push("/employer/home");
      }
    } catch (err) {
      console.error(err);
      alert("नौकरी पोस्ट करने में त्रुटि: " + (err instanceof Error ? err.message : "Internal Error"));
    }
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
                    onClick={() => setFormData((p) => ({ ...p, skill: s.id }))}
                    className={`p-3 rounded-lg border-2 text-sm font-medium ${formData.skill === s.id
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
                    className={`p-3 rounded-lg border-2 text-sm font-medium ${formData.duration === d.id
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

            {/* Image Upload Placeholder */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                काम की फोटो / Job Image
              </label>
              <div
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => alert("Upload functionality would go here. For now, we'll use a dummy image.")}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-700">फोटो अपलोड करें / Upload Photo</p>
                  <p className="text-[10px] text-gray-500">Add a clear photo of the work site</p>
                </div>
              </div>
              <p className="mt-2 text-[10px] text-gray-500 italic flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                A default work icon will be used if no photo is uploaded.
              </p>
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
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="यहाँ काम के बारे में विस्तार से लिखें..."
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
