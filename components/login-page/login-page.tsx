"use client"

import type React from "react"
import { useState } from "react"
import { Volume2 } from "lucide-react"
import Link from "next/link"

export function LoginPage() {
  const [mobile, setMobile] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/otp"
    }, 1000)
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl transition disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Otp"}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <Link href="/signup" className="text-sm text-blue-500 hover:underline">
              Register/रजिस्टर ?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
