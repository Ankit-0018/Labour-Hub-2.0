"use client";

import { useEffect } from "react";
import { UserData, useUserStore } from "@/lib/stores/useUserStore";


export default function UserHydrator({ user }: { user: UserData }) {
  const setUser = useUserStore((s) => s.setUser);
  const setHydrated = useUserStore((s) => s.setHydrated);

  useEffect(() => {
    useUserStore.persist.rehydrate();
    
    if (user) {
      setUser(user);
    }
    
    setHydrated();
  }, [user, setUser, setHydrated]);

  return null;
}
