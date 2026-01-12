"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { getUserState } from "@/utils/userState";
import { resolveRedirect } from "@/utils/routeGuards";

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter(); 
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      let userDoc;
      if (user) {
          const snap = await getDoc(doc(db, "users", user.uid));
          userDoc = snap.data();
        }
      const state = getUserState(user, userDoc);
      const redirectTo = resolveRedirect(state, pathname);
      if (redirectTo) {
        router.replace(redirectTo);
      } else {
         setLoading(false);
        }
      });
      return () => unsub();
    }, [pathname, router]);
  if (loading) return <p>Loading...</p>;
  return {children}       
}
