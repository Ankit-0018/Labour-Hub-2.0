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

  useEffect(() => {
    // The hydrated flag is automatically set by persist middleware
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return null;
}
