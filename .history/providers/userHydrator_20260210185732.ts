"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/stores/useUserStore";

export default function UserHydrator({ user } : any) {
  const setUser = useUserStore((s) => s.setUser);
  const setHydrated = useUserStore((s) => s.setHydrated);

  useEffect(() => {
    // Update user from server-side data if available
    if (user) {
      setUser(user);
    }
    
    // Mark as hydrated after a small delay to ensure persist middleware has loaded
    const timer = setTimeout(() => {
      setHydrated();
    }, 100);

    return () => clearTimeout(timer);
  }, [user, setUser, setHydrated]);

  return null;
}
