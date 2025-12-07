"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
function CustomOTPInput({ value, onChange, maxLength = 4 }: { value: string; onChange: (value: string) => void; maxLength?: number }) {
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
          className="w-14 h-14 border border-blue-600 bg-white rounded-sm text-center text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  )
}

export function OtpVerificationPage() {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/"
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E5E5] p-4 ">
      <div className="w-full max-w-sm " >
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg min-h-[520px]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-black mb-1">Labour Hub</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Label */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-black text-center">
                OTP/ओ.टी.पी
              </label>
              {/* OTP Input */}
              <div className="flex justify-center">
                <CustomOTPInput 
                  value={otp} 
                  onChange={setOtp}
                  maxLength={4}
                />
              </div>
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl transition disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Confirm"}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-blue-500 hover:underline">
              Change/बदले
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}