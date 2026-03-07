"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

export function LanguageToggle() {
  const { language, toggleLanguage, isHydrated } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isHydrated) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-white/50 border border-white/20"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">EN</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors text-sm font-semibold text-white border border-white/30 hover:border-white/50"
      title={`Click to switch language: ${language === "en" ? "Switch to हिंदी" : "Switch to English"}`}
      aria-label={`Current language: ${language === "en" ? "English" : "हिंदी"}. Click to toggle.`}
    >
      <Globe className="w-4 h-4" />
      <span className="hidden sm:inline">
        {language === "en" ? "EN" : "HI"}
      </span>
      <span className="hidden sm:inline text-xs opacity-75">
        {language === "en" ? "(हिंदी)" : "(English)"}
      </span>
    </button>
  );
}
