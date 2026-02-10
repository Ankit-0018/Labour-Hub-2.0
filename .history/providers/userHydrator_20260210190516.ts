"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/stores/useUserStore";

type UserData = {
  uid: string;
  role: "worker" | "employer";
  workStatus?: string;
  skillName?: string;
} | null;

export default function UserHydrator({ user }: { user: UserData }) {
  const setUser = useUserStore((s) => s.setUser);
  const setHydrated = useUserStore((s) => s.setHydrated);

  useEffect(() => {
    // Manually trigger rehydration from localStorage
    useUserStore.persist.rehydrate();
    
    // Update user from server if available
    if (user) {
      setUser(user);
    }
    
    // Mark as hydrated
    setHydrated();
  }, [user, setUser, setHydrated]);

  return null;
}
