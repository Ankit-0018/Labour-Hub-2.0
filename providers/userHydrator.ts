"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/stores/useUserStore";

export default function UserHydrator({ user } : any) {
  const setUser = useUserStore((s) => s.setUser);
  const setHydrated = useUserStore((s) => s.setHydrated);

  useEffect(() => {
    setUser(user);
    setHydrated();
  }, [user, setUser, setHydrated]);

  return null;
}
