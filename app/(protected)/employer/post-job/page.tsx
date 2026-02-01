"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  ChevronLeft,
} from "lucide-react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.skill || !formData.wage) {
      alert("कृपया सभी आवश्यक फील्ड भरें / Please fill all required fields");
      return;
    }

    //popup , console , refresh  when job pposted
    console.log("Job posted:", formData);
    alert("नौकरी पोस्ट की गई / Job posted successfully!");
    router.push("/employer/home");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-blue-600 text-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/employer/home">
            <ChevronLeft className="w-6 h-6 cursor-pointer hover:opacity-80" />
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                काम का नाम / Job Title *
              </label>
              <Input
                type="text"
                name="title"
                placeholder="जैसे: विद्युत मरम्मत / e.g. Electrical Repair"
                value={formData.title}
                onChange={handleChange}
                className="h-10 rounded-lg"
                required
              />
            </div>

            {/* Skill Required */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                आवश्यक कौशल / Skill Required *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SKILLS.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        skill: skill.id,
                      }))
                    }
                    className={`p-3 rounded-lg border-2 transition-all text-center text-sm font-medium ${
                      formData.skill === skill.id
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                    }`}
                  >
                    {skill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                अवधि / Duration
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DURATIONS.map((duration) => (
                  <button
                    key={duration.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: duration.id,
                      }))
                    }
                    className={`p-3 rounded-lg border-2 transition-all text-center text-sm font-medium ${
                      formData.duration === duration.id
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wage */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                मजदूरी / Wage (₹) *
              </label>
              <Input
                type="number"
                name="wage"
                placeholder="जैसे: 1200"
                value={formData.wage}
                onChange={handleChange}
                className="h-10 rounded-lg"
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                विवरण / Description
              </label>
              <textarea
                name="description"
                placeholder="काम के बारे में विवरण लिखें..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">💡 Tips:</span> स्पष्ट विवरण और
                उचित मजदूरी से आवेदन बढ़ते हैं। Clear descriptions and fair
                wages get more applications.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-lg font-semibold"
            >
              नौकरी पोस्ट करें / Post Job
            </Button>

            {/* Cancel Button */}
            <Link href="/employer/home" className="block">
              <Button
                type="button"
                variant="outline"
                className="w-full h-10 rounded-lg bg-transparent"
              >
                रद्द करें / Cancel
              </Button>
            </Link>
          </form>
        </div>
      </div>

      {/* Bottom Navigation */}
      <EmployerNav />
    </div>
  );
}












// -----------------clean code ------------------


// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import {
//   MapPin,
//   ChevronLeft,
//   Briefcase,
//   DollarSign,
//   Clock,
// } from "lucide-react";

// import { EmployerNav } from "@/components/navigation/EmployerNav";

// /* ------------------ DATA ------------------ */

// const SKILLS = [
//   { id: "labour", label: "Labour / लेबर" },
//   { id: "mason", label: "Mason / मिस्त्री" },
//   { id: "carpenter", label: "Carpenter / बढ़ई" },
//   { id: "plumber", label: "Plumber / प्लंबर" },
//   { id: "electrician", label: "Electrician / इलेक्ट्रीशियन" },
//   { id: "painter", label: "Painter / पेंटर" },
// ];

// const DURATIONS = [
//   { id: "4hours", label: "4 घंटे / 4 Hours" },
//   { id: "8hours", label: "8 घंटे / 8 Hours" },
//   { id: "fullday", label: "पूरा दिन / Full Day" },
//   { id: "halfday", label: "आधा दिन / Half Day" },
// ];

// /* ------------------ COMPONENT ------------------ */

// export default function PostJobPage() {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     title: "",
//     skill: "",
//     wage: "",
//     duration: "",
//     description: "",
//     location: "Sector 5, Gurgaon",
//   });

//   /* -------- handlers -------- */

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.title || !formData.skill || !formData.wage) {
//       alert("कृपया सभी आवश्यक फील्ड भरें");
//       return;
//     }

//     console.log("JOB DATA →", formData);

//     router.push("/employer/home");
//   };

//   /* ------------------ UI ------------------ */

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">

//       {/* HEADER */}
//       <div className="sticky top-0 z-40 bg-blue-600 text-white">
//         <div className="px-4 py-4 flex items-center gap-3">
//           <Link href="/employer/home">
//             <ChevronLeft className="w-6 h-6" />
//           </Link>

//           <div>
//             <h1 className="text-xl font-bold">
//               नई नौकरी पोस्ट करें
//             </h1>
//             <p className="text-sm text-blue-100">
//               Post a new job
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* FORM */}
//       <div className="max-w-md mx-auto px-4 py-6">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white rounded-2xl p-6 shadow space-y-6"
//         >

//           {/* Job title */}
//           <div>
//             <label className="text-sm font-semibold flex items-center gap-2">
//               <Briefcase className="w-4 h-4" />
//               काम का नाम
//             </label>

//             <Input
//               name="title"
//               placeholder="Electrical repair"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Skill */}
//           <div>
//             <label className="text-sm font-semibold">
//               आवश्यक कौशल
//             </label>

//             <div className="grid grid-cols-2 gap-2 mt-2">
//               {SKILLS.map((skill) => (
//                 <button
//                   key={skill.id}
//                   type="button"
//                   onClick={() =>
//                     setFormData((p) => ({
//                       ...p,
//                       skill: skill.id,
//                     }))
//                   }
//                   className={`p-3 rounded-lg border text-sm font-medium transition ${
//                     formData.skill === skill.id
//                       ? "border-blue-600 bg-blue-50"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   {skill.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Duration */}
//           <div>
//             <label className="text-sm font-semibold flex items-center gap-2">
//               <Clock className="w-4 h-4" />
//               अवधि
//             </label>

//             <div className="grid grid-cols-2 gap-2 mt-2">
//               {DURATIONS.map((d) => (
//                 <button
//                   key={d.id}
//                   type="button"
//                   onClick={() =>
//                     setFormData((p) => ({
//                       ...p,
//                       duration: d.id,
//                     }))
//                   }
//                   className={`p-3 rounded-lg border text-sm transition ${
//                     formData.duration === d.id
//                       ? "border-blue-600 bg-blue-50"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   {d.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Wage */}
//           <div>
//             <label className="text-sm font-semibold flex items-center gap-2">
//               <DollarSign className="w-4 h-4" />
//               मजदूरी (₹)
//             </label>

//             <Input
//               type="number"
//               name="wage"
//               placeholder="1200"
//               value={formData.wage}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Location */}
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
//             <MapPin className="w-5 h-5 text-blue-600" />
//             <span className="text-sm">
//               {formData.location} (3 km)
//             </span>
//           </div>

//           {/* Description */}
//           <div>
//             <label className="text-sm font-semibold">
//               विवरण
//             </label>

//             <textarea
//               name="description"
//               rows={3}
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="काम का विवरण लिखें"
//               className="w-full border rounded-lg p-2"
//             />
//           </div>

//           {/* Submit */}
//           <Button className="w-full bg-blue-600 hover:bg-blue-700">
//             नौकरी पोस्ट करें
//           </Button>

//           {/* Cancel */}
//           <Link href="/employer/home">
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full"
//             >
//               रद्द करें
//             </Button>
//           </Link>
//         </form>
//       </div>

//       {/* BOTTOM NAV */}
//       <EmployerNav />
//     </div>
//   );
// }
