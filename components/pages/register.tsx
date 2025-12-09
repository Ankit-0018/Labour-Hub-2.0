"use client"

import type React from "react"
import { useState } from "react"
import { Volume2 } from "lucide-react"
import Link from "next/link"
import { useOTPAuth } from "@/hooks/useOTPAuth"
import { CustomOTPInput } from "../_shared/otp-input"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const {sendOTP , verifyOtp , confirmationResult , mobile , setMobile , otp , setOtp} = useOTPAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if(confirmationResult){
     await verifyOtp("register" , name);
    } else {
      const result = await sendOTP(e);
      if(result.success){
        alert("OTP sent!");}
    else {
      alert("Error in sending OTP")
    }
  }
    } catch (error) {
      alert("Error in login");
    } finally{
      setIsLoading(false);
    }
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E5E5] p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg  min-h-[520px]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-black mb-1">Labour Hub</h1>
            <p className="text-sm text-gray-500">Register/रजिस्टर</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* FullName Field */}
            <div className="space-y-2">
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
            </div>

            {/* Mobile Number Field */}
            <div className="space-y-2">
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
            </div>
             {confirmationResult && <div className="space-y-2">
              <label className="block text-sm font-medium text-black">
                OTP/ओ.टी.पी
              </label>
              {/* OTP Input */}
              <div className="flex justify-center">
                <CustomOTPInput 
                  value={otp} 
                  onChange={setOtp}
                  maxLength={6}
                />
              </div>
            </div>
              }


            {/* Submit Button */}
            <button
  type="submit"
  disabled={isLoading}
  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl transition disabled:opacity-50"
>
  {isLoading
    ? "Please wait..."
    : confirmationResult
    ? "Verify OTP"
    : "Send OTP"}
</button>

          </form>
<div id="recaptcha-container"></div>
          {/* Footer Link */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-blue-500 hover:underline">
              Login/लॉग इन ?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
