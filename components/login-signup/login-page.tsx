"use client"

import type React from "react"

import { useState } from "react"
import { Volume2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export function LoginPage() {
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"mobile" | "otp">("mobile")
  const [isLoading, setIsLoading] = useState(false)
  const { t, language } = useLanguage()

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false)
      setStep("otp")
    }, 1000)
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to home
      window.location.href = "/"
    }, 1000)
  }

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === "hi" ? "hi-IN" : "en-US"
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">LabourHub</h1>
            <p className="text-sm text-muted-foreground">{step === "mobile" ? t("auth.login") : "Verify OTP"}</p>
          </div>

          {/* Form */}
          <form onSubmit={step === "mobile" ? handleMobileSubmit : handleOtpSubmit} className="space-y-6">
            {step === "mobile" ? (
              <>
                {/* Mobile Number Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    {language === "en" ? "Mob no" : "मोबाइल नं."}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter your mobile number"
                      className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleSpeak(t("auth.mobile"))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
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
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-2xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                  <ArrowRight size={18} />
                </button>
              </>
            ) : (
              <>
                {/* OTP Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    {language === "en" ? "Enter OTP" : "ओटीपी दर्ज करें"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition text-center tracking-widest text-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleSpeak(t("auth.otp"))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
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
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-2xl transition disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : t("auth.login")}
                </button>
              </>
            )}
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("auth.noAccount")}{" "}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
