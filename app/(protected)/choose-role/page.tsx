'use client';
import ChooseRole from '@/components/sections/choose-role';
import recruitor from "@/assets/recruitor.jpg";
import labour from "@/assets/labour.jpg";
import type { Role, RoleItem } from '@/components/sections/choose-role';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const roles : RoleItem[] = [
    {
        imgSrc : labour,
        title : "मुझे काम चाहिए/I need work",
        role : "worker"
    },
    {
        imgSrc : recruitor,
        title : "मुझे कर्मचारी चाहिए/I need workers",
        role : "employer"
    }
]

export default  function ChooseRolePage(){
    const router = useRouter();
    const [selectedRole , setSelectedRole] = useState<Role>(roles[0].role);
    const [loading , setLoading] = useState<boolean>(false);
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
    
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            role: selectedRole,
          });
    
    
          const token = await user.getIdToken();
    
          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token,
              role: selectedRole,
            }),
          });
    
          router.push(`/${selectedRole}/home`);
        } catch (err) {
          console.error(err);
          alert("Failed to set role. Try again.");
        } finally {
          setLoading(false);
        }
      };

    return <ChooseRole roles={roles} onSelection={handleRoleSelection} setSelectedRole={setSelectedRole} />
}