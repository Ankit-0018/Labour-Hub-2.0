"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/stores/useUserStore";
import { UserRole } from "@/lib/stores/useUserStore";
import Spinner from "./spinner";


export default function RoleGuard({
  children,
  role,
}: {
  children: ReactNode;
  role: UserRole;
}) {
  const { user, loading } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // router.replace("/login");
        return;
      }

      if (user.role !== role) {
        router.replace("/");
      }
    }
  }, [user, loading, role, router]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  if (!user || user.role !== role) return null;

  return <>{children}</>;
}
