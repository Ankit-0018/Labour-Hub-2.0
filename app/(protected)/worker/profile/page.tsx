"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import "@/styles/worker.css";
import {
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Wallet,
  Edit2,
  Camera,
  LogOut,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type WorkerProfile = {
  name: string;
  phone: string;
  email: string;
  location: string;
  skill: string;
  dailyWage: number;
  rating: number;
  reviews: number;
  jobsCompleted: number;
  totalEarnings: number;
  memberSince: string;
  isVerified: boolean;
};

export default function WorkerProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
<<<<<<< HEAD
      // if (!auth.currentUser) {
      //   router.push("/");
      //   return;
      // }

      try {
        // const userRef = doc(db, "users", auth.currentUser.uid);
        // const userSnap = await getDoc(userRef);

        // if (userSnap.exists()) {
        //   const userData = userSnap.data();
        //   setProfile({
        //     name: userData.name || "Worker Name",
        //     phone: auth.currentUser.phoneNumber || "Not set",
        //     email: userData.email || "Not set",
        //     location: userData.location || "Sector 5, Gurgaon",
        //     skill: userData.skillName || "Electrician",
        //     dailyWage: userData.dailyWage || 1000,
        //     rating: userData.rating || 4.8,
        //     reviews: userData.reviews || 45,
        //     jobsCompleted: userData.jobsCompleted || 128,
        //     totalEarnings: userData.totalEarnings || 156000,
        //     memberSince: "January 2024",
        //     isVerified: userData.isVerified || false,
        //   });
        // }
        
        // Mock data for development
        setProfile({
          name: "Worker Name",
          phone: "Not set",
          email: "Not set",
          location: "Sector 5, Gurgaon",
          skill: "Electrician",
          dailyWage: 1000,
          rating: 4.8,
          reviews: 45,
          jobsCompleted: 128,
          totalEarnings: 156000,
          memberSince: "January 2024",
          isVerified: false,
        });
=======
      if (!auth.currentUser) {
        router.push("/");
        return;
      }

      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setProfile({
            name: userData.name || "Worker Name",
            phone: auth.currentUser.phoneNumber || "Not set",
            email: userData.email || "Not set",
            location: userData.location || "Sector 5, Gurgaon",
            skill: userData.skillName || "Electrician",
            dailyWage: userData.dailyWage || 1000,
            rating: userData.rating || 4.8,
            reviews: userData.reviews || 45,
            jobsCompleted: userData.jobsCompleted || 128,
            totalEarnings: userData.totalEarnings || 156000,
            memberSince: "January 2024",
            isVerified: userData.isVerified || false,
          });
        }
>>>>>>> refs/remotes/origin/worker
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
<<<<<<< HEAD
      // await signOut(auth);
      // router.push("/");
      console.log("Logout disabled for development");
=======
      await signOut(auth);
      router.push("/");
>>>>>>> refs/remotes/origin/worker
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="worker-container">
        <div className="worker-layout flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="worker-container">
      <div className="worker-layout">
        {/* Header */}
        <div className="worker-header">
          <div className="worker-header-content">
            <h1 className="worker-header-title">प्रोफाइल / Profile</h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary/80"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="text-2xl">👨‍🔧</span>
            <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 border-2 border-primary-foreground">
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <h2 className="profile-name">{profile.name}</h2>
          <p className="profile-skill">{profile.skill}</p>
          <div className="flex items-center gap-2 mt-2">
            {profile.isVerified && (
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                ✅ Verified
              </span>
            )}
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
              ⭐ {profile.rating} ({profile.reviews} reviews)
            </span>
          </div>
        </div>

        {/* Profile Info */}
        <div className="profile-info">
          {/* Contact Info */}
          <div className="bg-card rounded-lg p-4 shadow-sm space-y-4">
            <h3 className="font-semibold">Contact Information</h3>
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Phone</p>
                {isEditing ? (
                  <Input defaultValue={profile.phone} className="h-8" />
                ) : (
                  <p className="font-medium">+91 {profile.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                {isEditing ? (
                  <Input defaultValue={profile.email} className="h-8" />
                ) : (
                  <p className="font-medium">{profile.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Location</p>
                {isEditing ? (
                  <Input defaultValue={profile.location} className="h-8" />
                ) : (
                  <p className="font-medium">{profile.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Work Info */}
          <div className="bg-card rounded-lg p-4 shadow-sm space-y-4">
            <h3 className="font-semibold">Work Information</h3>
            
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Primary Skill</p>
                {isEditing ? (
                  <select className="w-full px-3 py-2 rounded-md border border-input bg-background">
                    <option>Electrician</option>
                    <option>Plumber</option>
                    <option>Carpenter</option>
                  </select>
                ) : (
                  <p className="font-medium">{profile.skill}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Daily Wage (₹)</p>
                {isEditing ? (
                  <Input type="number" defaultValue={profile.dailyWage} className="h-8" />
                ) : (
                  <p className="font-medium">₹{profile.dailyWage}/day</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-lg p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">{profile.jobsCompleted}</p>
              <p className="text-xs text-muted-foreground">Jobs Completed</p>
            </div>
            <div className="bg-card rounded-lg p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">₹{(profile.totalEarnings / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Total Earned</p>
            </div>
          </div>

          {/* Member Since */}
          <div className="bg-secondary/30 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Member since <span className="font-medium">{profile.memberSince}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-4 space-y-3 pb-32">
          <Button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {loggingOut ? "लॉगआउट हो रहे हैं..." : "लॉगआउट / Logout"}
          </Button>

          <Button
            variant="outline"
            className="w-full bg-transparent border-gray-300 text-gray-700 h-10 rounded-lg"
          >
            पासवर्ड बदलें / Change Password
          </Button>

          <Button
            variant="outline"
            className="w-full bg-red-50 border-red-200 text-red-700 hover:bg-red-100 h-10 rounded-lg"
          >
            खाता हटाएं / Delete Account
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <WorkerNav />
    </div>
  );
}
