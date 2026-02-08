'use client';

import ChooseRole from '@/components/sections/choose-role';
import recruitor from "@/assets/recruitor.jpg";
import labour from "@/assets/labour.jpg";
import type { Role, RoleItem } from '@/components/sections/choose-role';
import { auth} from '@/lib/firebase/firebase';
import { useState } from 'react';
import { setSession } from '@/lib/utils/auth/session';

const roles: RoleItem[] = [
  {
    imgSrc: labour,
    title: "मुझे काम चाहिए / I need work",
    role: "worker"
  },
  {
    imgSrc: recruitor,
    title: "मुझे कर्मचारी चाहिए / I need workers",
    role: "employer"
  }
];

export default function ChooseRolePage() {
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0].role);
  const [loading, setLoading] = useState<boolean>(false);

 const handleRoleSelection = async () => {
  if (!selectedRole) {
    alert("Please select a role");
    return;
  }

  try {
    setLoading(true);

    const user = auth.currentUser;
    if (!user) {
      alert("Not authenticated");
      return;
    }

    // get fresh ID token
    const token = await user.getIdToken(true);

    await fetch("/api/user/set-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: selectedRole, token }),
    });

    // refresh session cookie (important)
    await setSession(token);
    window.location.href = "/";;
  } catch (err) {
    console.error(err);
    alert("Failed to set role. Try again.");
  } finally {
    setLoading(false);
  }
 }
  return (
    <ChooseRole
      roles={roles}
      onSelection={handleRoleSelection}
      setSelectedRole={setSelectedRole}
      loading={loading}
    />
  );
}
