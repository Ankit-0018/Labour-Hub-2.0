"use client";

import type React from "react";
import { Volume2 } from "lucide-react";
import Link from "next/link";
import { useOTPAuth } from "@/hooks/useOTPAuth";
import { CustomOTPInput } from "@/components/_shared/otp-input";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthPage() {
  const searchParams = useSearchParams();
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
    setRole,
    verifyOtp,
    loading,
    numErr,
    nameErr,
    resetAuthState
  } = useOTPAuth();

  // Set role from URL when page loads
  useEffect(() => {
    setRole(mode);
     resetAuthState();
  }, [mode, setRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmationResult) {
      // ROLE MUST BE SET BEFORE sending OTP
      setRole(mode);

      await sendOTP(e);

      // ROLE MUST BE SET AGAIN AFTER OTP IS SENT
      // Ensures verifyOtp knows exactly what flow to follow
      setRole(mode);
    } else {
      // OTP stage → verifyOtp needs the correct role
      await verifyOtp(e);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="min-h-screen flex items-center justify-center bg-[#E5E5E5] p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg  min-h-[520px]"></div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-black mb-1">Labour Hub</h1>
        <p className="text-sm text-gray-500">
          {mode === "register" ? "Register/रजिस्टर" : "Login/लॉग इन"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Name field only in register + ONLY before OTP */}
        {mode === "register" && !confirmationResult && (
          <div className=" relative space-y-2">
            <label className="block text-sm font-medium text-black">
              FullName/पूरा नाम
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="eg. अंकित कुमार"
                className="w-full px-4 py-3 pr-12 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition"
                aria-label="Speak"
              >
                <Volume2 size={18} />
              </button>
            </div>
             {nameErr && <p className="absolute top-0 right-2 text-xs text-red-500">* {nameErr}</p>}
          </div>
        )}

        {/* Mobile Number Field */}
        {!confirmationResult && (
          <div className="relative space-y-2">
            <label className="block text-sm font-medium text-black">
              Mobile no./मोबाइल नं.
            </label>
            <div className="relative">
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 xxxxxxxxxx"
                className="w-full px-4 py-3 pr-12 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition"
                aria-label="Speak"
              >
                <Volume2 size={18} />
              </button>
            </div>
           {numErr && <p className="absolute top-0 right-2 text-xs text-red-500">* {numErr}</p>}
          </div>
        )}

        {/* OTP FIELD */}
        {confirmationResult && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">
              OTP/ओ.टी.पी
            </label>
            <div className="flex justify-center">
              <CustomOTPInput value={otp} onChange={setOtp} maxLength={6} />
            </div>
          </div>
        )}

        {/* BUTTON */}
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

     
      {/* Footer Link */}
      <div className="mt-6 text-center">
        {mode === "login" ? (
          <Link href="/auth?mode=register" className="text-sm text-blue-500 hover:underline">
            Create new account / रजिस्टर करें ?
          </Link>
        ) : (
          <Link href="/auth?mode=login" className="text-sm text-blue-500 hover:underline">
            Already have an account? Login
          </Link>
        )}
      </div>
      </div>
         <div id="recaptcha-container"></div>
      </div>
    </>
  );
}
