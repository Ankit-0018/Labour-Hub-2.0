"use client";

import type React from "react";
import Link from "next/link";
import { useOTPAuth } from "@/hooks/useOTPAuth";
import { CustomOTPInput } from "@/components/_shared/otp-input";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get("mode") === "register" ? "register" : "login";

  const {
    sendOTP,
    confirmationResult,
    mobile,
    setMobile,
    otp,
    setOtp,
    name,
    setName,
    verifyOtp,
    loading,
    numErr,
    nameErr,
  } = useOTPAuth(mode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmationResult) {
      await sendOTP();
      return;
    }

    const res = await verifyOtp();
    if (!res.success || !res.user) {
      alert("OTP verification failed");
      return;
    }

    const user = res.user;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const token = await user.getIdToken();
   if (mode === "register") {
      if (userSnap.exists()) {
        alert("Account already exists. Please login.");
        router.push("/auth?mode=login");
        return;
      }

      await setDoc(userRef, {
        name,
        phone: user.phoneNumber,
        role: null,
        createdAt: new Date(),
      });

      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          role: null, 
        }),
      });

      router.push("/choose-role");
      return;
    }

    if (mode === "login") {
      if (!userSnap.exists()) {
        alert("No account found. Please register.");
        router.push("/auth?mode=register");
        return;
      }

      const Urole = userSnap.data().role ?? null;

      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          role : Urole, 
        }),
      });

      router.push(Urole ? `/${Urole}/home` : "/choose-role");
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E5E5] p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl p-8 shadow-lg min-h-[520px]">

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-black mb-1">
              Labour Hub
            </h1>
            <p className="text-sm text-gray-500">
              {mode === "register" ? "Register/रजिस्टर" : "Login/लॉग इन"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {mode === "register" && !confirmationResult && (
              <div className="relative space-y-2">
                <label className="block text-sm font-medium text-black">
                  Full Name / पूरा नाम
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                   placeholder="eg. अंकित कुमार"
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl"
                  required
                />
                {nameErr && (
                  <p className="text-xs text-red-500">{nameErr}</p>
                )}
              </div>
            )}

            {!confirmationResult && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">
                  Mobile no./मोबाइल नं.
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 xxxxxxxxxx"
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl"
                  required
                />
                {numErr && (
                  <p className="text-xs text-red-500">{numErr}</p>
                )}
              </div>
            )}

            {confirmationResult && (
              <CustomOTPInput value={otp} onChange={setOtp} maxLength={6} />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl transition disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : confirmationResult
                ? "Verify OTP"
                : "Send OTP"}
            </button>
          </form>

          <div className="mt-6 text-center">
            {mode === "login" ? (
              <Link
                href="/auth?mode=register"
                className="text-sm text-blue-500 hover:underline"
              >
                Create new account / रजिस्टर करें ?
              </Link>
            ) : (
              <Link
                href="/auth?mode=login"
                className="text-sm text-blue-500 hover:underline"
              >
                Already have an account? Login
              </Link>
            )}
          </div>

        </div>

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
