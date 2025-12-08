"use client"

import type React from "react"
import { useState } from "react"
import { Volume2 } from "lucide-react"
import Link from "next/link"
import { auth, db, generateRecaptcha } from "@/lib/firebase";
import {signInWithPhoneNumber} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

export function LoginPage() {
  const [mobile, setMobile] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
   const [otp, setOtp] = useState("");

 const verifyOtp = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
          const user = result.user;

       if (!user) {
      alert("OTP failed");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("No account found. Please register first.");
      return;
    }

    alert("Login Successful!");
      console.log("User:", result.user);
      alert("Logged in!");
    } catch (err) {
      console.error(err);
      alert("Wrong OTP");
    }
  };


  const sendOtp = async (e: React.FormEvent) => {
    try {
      setIsLoading(true);
      const recaptchaVerifier = generateRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, mobile, recaptchaVerifier);
      console.log("OTP sent successfully", confirmationResult);
       setConfirmationResult(confirmationResult);
      alert("OTP sent!");
    } catch (error) {
      console.error("Error during signInWithPhoneNumber", error);
       alert("Error sending OTP");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (confirmationResult) {
      await verifyOtp();
    } else {

      await sendOtp(e);
    }

  }


   
function CustomOTPInput({ value, onChange, maxLength = 6 }: { value: string; onChange: (value: string) => void; maxLength?: number }) {
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, maxLength)
    onChange(pastedData)
    
    const nextIndex = Math.min(pastedData.length - 1, maxLength - 1)
    setTimeout(() => {
      const nextInput = document.getElementById(`otp-${nextIndex}`)
      nextInput?.focus()
    }, 0)
  }

  const handleChange = (index: number, digitValue: string) => {
    const newOtp = value.split('')
    newOtp[index] = digitValue
    onChange(newOtp.join(''))
    
    if (digitValue && index < maxLength - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  return (
    <div className="flex gap-4 justify-center">
      {[...Array(maxLength)].map((_, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-full h-10 border border-blue-600 bg-white rounded-sm text-center text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  )
}

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E5E5] p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg min-h-[520px]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-black mb-1">Labour Hub</h1>
            <p className="text-sm text-gray-500">Login/लॉग इन</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
              {isLoading ? "Sending..." : confirmationResult ? "Verify OTP" : "Send OTP"}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <Link href="/signup" className="text-sm text-blue-500 hover:underline">
              Register/रजिस्टर ?
            </Link>
          </div>
          
          {/* invisible recaptcha container */}
          <div id="recaptcha-container"></div>
          
        </div>
      </div>
    </div>
  )
}
