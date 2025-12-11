"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({ children } : { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login"); // redirect to login if not logged in
      }
      setTimeout(() => {
        setLoading(false);

      }, 3000)
    });

    return () => unsub();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
