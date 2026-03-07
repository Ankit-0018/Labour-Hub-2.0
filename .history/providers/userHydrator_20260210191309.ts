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
    useUserStore.persist.rehydrate();
    
    if (user) {
      setUser(user);
    }
    
    // Mark as hydrated
    setHydrated();
  }, [user, setUser, setHydrated]);

  return null;
}
