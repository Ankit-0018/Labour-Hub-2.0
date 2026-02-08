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

<<<<<<< HEAD
    await fetch("/api/user/set-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: selectedRole, token }),
    });
=======
      // const user = auth.currentUser;
      // if (!user) {
      //   alert("Not authenticated");
      //   return;
      // }

      // const userRef = doc(db, "users", user.uid);
      // const rolePayload =
      //   selectedRole === "worker"
      //     ? {
      //         role: "worker",
      //         worker: {
      //           skills: [],
      //           experience: 0,
      //           dailyWage: null,
      //           availability: true,
      //           rating: 0,
      //           totalJobs: 0,
      //           location: null,
      //           verified: false,
      //         },
      //       }
      //     : {
      //         role: "employer",
      //         employer: {
      //           companyName: "",
      //           businessType: "",
      //           rating: 0,
      //           totalJobsPosted: 0,
      //         },
      //       };

      // await updateDoc(userRef, {
      //   ...rolePayload,
      //   roleSelectedAt: serverTimestamp(),
      // });

      // session sync
      // const token = await user.getIdToken();
      // await fetch("/api/auth/session", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     token,
      //     role: selectedRole,
      //   }),
      // });

      // router.push(`/${selectedRole}/home`);
    } catch (err) {
      console.error(err);
      alert("Failed to set role. Try again.");
    } finally {
      setLoading(false);
    }
  };
>>>>>>> 0133517 (stopped authentication for checking all the pages of worker and  employer)

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
