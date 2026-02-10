"use client";

import { useEffect, useRef } from "react";
import { auth } from "@/lib/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }

      if (user) {
        // Get fresh token and update session
        const token = await user.getIdToken(true);
        await updateSession(token);

        // Set up token refresh every 50 minutes (tokens expire in 60 minutes)
        refreshIntervalRef.current = setInterval(
          async () => {
            try {
              const currentUser = auth.currentUser;
              if (currentUser) {
                const freshToken = await currentUser.getIdToken(true);
                await updateSession(freshToken);
                console.log("Token refreshed successfully");
              }
            } catch (error) {
              console.error("Failed to refresh token:", error);
              // If refresh fails, redirect to login
              window.location.href = "/auth?mode=login";
            }
          },
          50 * 60 * 1000
        ); // 50 minutes
      } else {
        // User logged out, clear session
        await fetch("/api/auth/session", { method: "DELETE" });
      }
    });

    return () => {
      unsubscribe();
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  return <>{children}</>;
}

async function updateSession(token: string) {
  try {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  } catch (error) {
    console.error("Failed to update session:", error);
  }
}
