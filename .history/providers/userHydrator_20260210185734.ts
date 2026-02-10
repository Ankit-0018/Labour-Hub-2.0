"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/stores/useUserStore";

export default function UserHydrator({ user } : any) {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    // Only update user from server-side data if available
    // The hydrated flag is automatically set by persist middleware
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return null;
}
