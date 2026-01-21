"use client";

import Image from "next/image";
import { useState } from "react";
import Labour from "@/assets/Labourr.jpg";
import Mason from "@/assets/Mason.jpg";
import Carpenter from "@/assets/Carpenter.jpg";
import Plumber from "@/assets/Plumber.jpg";
import Electrician from "@/assets/Electrician.jpg";
import Painter from "@/assets/Painter.jpg";

const SKILLS = [
  { id: "labour", label: "Labour / लेबर", img: Labour },
  { id: "mason", label: "Mason / मिस्त्री", img: Mason },
  { id: "carpenter", label: "Carpenter / बढ़ई", img: Carpenter },
  { id: "plumber", label: "Plumber / प्लंबर", img: Plumber },
  { id: "electrician", label: "Electrician / इलेक्ट्रीशियन", img: Electrician },
  { id: "painter", label: "Painter / पेंटर", img: Painter },
];

export default function Page() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center px-4">
      {/* Card Container */}
      <div className="w-full max-w-sm bg-[#dcdcdc] rounded-xl p-5 relative">
        {/* Heading */}
        <h1 className="text-lg font-semibold leading-tight mb-5">
          Choose your primary skills/
          <br />
          <span className="font-medium">अपना प्राथमिक कौशल चुनें</span>
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">
          {SKILLS.map((skill) => {
            const isActive = selected === skill.id;

            return (
              <button
                key={skill.id}
                onClick={() => setSelected(skill.id)}
                className={`relative rounded-2xl overflow-hidden border-2 transition
                  ${
                    isActive
                      ? "border-blue-500 ring-2 ring-blue-300"
                      : "border-transparent"
                  }`}
              >
                <Image
                  src={skill.img}
                  alt={skill.label}
                  className="object-cover w-full h-40"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/35" />

                {/* Label */}
                <p className="absolute bottom-3 left-3 text-white text-sm font-medium">
                  {skill.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Confirm Button */}
        <button
          disabled={!selected}
          className={`mt-6 w-full py-3 rounded-xl text-white font-semibold transition
            ${
              selected
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-300 cursor-not-allowed"
            }`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
