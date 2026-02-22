"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import { useUserStore } from "@/lib/stores/useUserStore";
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
import { getWorkerProfileAction, updateWorkerProfileAction } from "@/lib/server/actions";

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
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setError(null);
        const data = await getWorkerProfileAction();
        if (!data) throw new Error("Profile Not Found");
        setProfile(data);
        setEditData({
          phone: data.phone,
          email: data.email,
          location: data.location,
          skill: data.skill,
          dailyWage: data.dailyWage,
        });
      } catch (err: any) {
        console.error("Error loading profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save logic
      try {
        setLoading(true);
        await updateWorkerProfileAction({
          phone: editData.phone,
          email: editData.email,
          location: editData.location,
          "workerProfile.skills": [editData.skill],
          "workerProfile.dailyWage": Number(editData.dailyWage),
        });
        // Refresh
        const data = await getWorkerProfileAction();
        setProfile(data);
      } catch (err) {
        console.error(err);
        alert("Error saving profile");
      } finally {
        setLoading(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const clearUser = useUserStore((s) => s.clearUser);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const { auth } = await import("@/lib/firebase/firebase");
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
      await fetch("/api/auth/session", { method: "DELETE" });
      clearUser(); // Clear persisted store data
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="worker-container">
        <div className="worker-layout flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="worker-container">
        <div className="worker-layout flex items-center justify-center h-screen bg-gray-50 p-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center max-w-sm w-full">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error || "Could not load profile. Please try again later."}</p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl"
            >
              Try Again / दोबारा प्रयास करें
            </Button>
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
              onClick={handleEditToggle}
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
                  <Input
                    value={editData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, phone: e.target.value })}
                    className="h-8"
                  />
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
                  <Input
                    value={editData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, email: e.target.value })}
                    className="h-8"
                  />
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
                  <Input
                    value={editData.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, location: e.target.value })}
                    className="h-8"
                  />
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
                  <select
                    value={editData.skill}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditData({ ...editData, skill: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  >
                    <option value="electrician">Electrician</option>
                    <option value="plumber">Plumber</option>
                    <option value="carpenter">Carpenter</option>
                    <option value="painter">Painter</option>
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
                  <Input
                    type="number"
                    value={editData.dailyWage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, dailyWage: e.target.value })}
                    className="h-8"
                  />
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
              <p className="text-2xl font-bold text-primary">₹{profile.totalEarnings >= 1000 ? `${(profile.totalEarnings / 1000).toFixed(1)}K` : profile.totalEarnings}</p>
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
