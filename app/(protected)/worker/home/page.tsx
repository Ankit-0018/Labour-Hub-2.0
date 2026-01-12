'use client';
import BottomBar from '@/components/_shared/bottom-bar';
import JobCard from '@/components/_shared/cards/job';
import { logout } from '@/lib/auth/logout'
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { useState } from 'react';

const MOCK_JOBS = [
  {
    id: 1,
    title: "Plumbing Work",
    address: "Sector 18, Noida",
    distance: "1.2 km",
    pay: "₹500",
  },
  {
    id: 2,
    title: "Electrician Needed",
    address: "Sector 22, Noida",
    distance: "2.5 km",
    pay: "₹700",
  },
  {
    id: 3,
    title: "Bathroom Repair",
    address: "Sector 15, Noida",
    distance: "2.9 km",
    pay: "₹600",
  },
];

const Home = () => {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const handleLogout = async () => {
    try {
      await logout(); 
      router.push('/auth?mode=login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  return (

     <div className="min-h-screen bg-gray-100 px-4 pt-5 pb-24">
      {/* Location */}
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-blue-500" size={18} />
        <span className="text-sm text-gray-700">
          Your location: <strong>Noida, UP</strong>
        </span>
      </div>

      {/* Status Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setActive(!active)}
          className={`w-full py-4 rounded-xl text-lg font-semibold text-white transition
            ${
              active
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
        >
          {active ? "🟢 Active for Work" : "⚪ Inactive"}
        </button>

        <p className="text-center text-xs text-gray-500 mt-2">
          {active
            ? "You will receive nearby work requests"
            : "You are currently not visible to employers"}
        </p>
      </div>

      {/* Nearby Work */}
      <h2 className="text-base font-semibold mb-3">
        Work near you (within 3 km)
      </h2>

      <div className="space-y-3">
        {MOCK_JOBS.map((job) => (
         <JobCard
  title="Mason (मिस्त्री) की आवश्यकता है"
  location="Rourkela Industrial Township (ITS), Odisha"
  salary="₹19,500"
  image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsWOSF50BVvHSLNuAVIMx-w5p_IcRWhT8njg&s"
/>

        ))}
      </div>
      <button onClick={handleLogout} className='py-2 px-4 text-black rounded-md bg-red-600'>Log Out</button>
      <BottomBar />
    </div>
      
  
  )
}

export default Home
