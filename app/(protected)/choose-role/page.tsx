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

export default async function ChooseRolePage(){
    const router = useRouter();
    const [selectedRole , setSelectedRole] = useState<Role>();
    const handleRoleSelection = async () => {
    const user = auth.currentUser;
    //update the db roles
    if(!user) {
        throw new Error("User not authenticated!")
    }
    try {
        await updateDoc(
        doc(db, "users", user.uid), 
       {
         isRoleChosen: true,  
       }
     );
        
       if(selectedRole == "employer"){
        router.push("employer/home")
       } else {
        router.push("worker/home")
       }

        } 
    catch (error) {
            console.log("Error while updating the db")
        }
    }

    return <ChooseRole roles={roles} onSelection={handleRoleSelection} />
}