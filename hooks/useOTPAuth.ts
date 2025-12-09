"use client";

import { useState } from "react";
import { auth, db, generateRecaptcha } from "@/lib/firebase";
import { signInWithPhoneNumber, ConfirmationResult, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {useRouter} from "next/navigation";

interface OTPResult {
  success: boolean;
  user?: User;
  error?: any;
}

export function useOTPAuth() {
  const [otp, setOtp] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  //send OTP
  const sendOTP = async (e: React.FormEvent): Promise<OTPResult> => {
    try {
      e.preventDefault();
      setLoading(true);
      const recaptcha = generateRecaptcha();
      console.log("Recaptcha generated:", recaptcha);
      if (!recaptcha) {
        throw new Error("Recaptcha not initialized");
      }
      console.log("Sending OTP to:", mobile);
      const result = await signInWithPhoneNumber(auth, mobile, recaptcha);

      setConfirmationResult(result);
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // verify OTP
  const verifyOtp = async (role:string , name? : string) => {
    if(role === "login"){
       try {
            const result = await confirmationResult?.confirm(otp);
                const user = result?.user;
      
             if (!user) {
            alert("OTP failed");
            return;
          }
      
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
      
          if (!userSnap.exists()) {
            alert("No account found. Please register first.");
            return;
          }
            console.log("User:", result.user);
            alert("Logged in!");
            router.push("/home");
          } catch (err) {
            console.error(err);
            alert("Wrong OTP");
          }
    } else {
      try {
        const result = await confirmationResult?.confirm(otp);
        const user = result?.user; // Firebase Auth user
        if(!user){
          throw new Error("OTP verification failed");
        }   
      //check if user already exists
      const userRef = doc(db, "users", user?.uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        alert("User already registered. Please log in instead.");
        return;
      }
      
      //basic validation
       if (!name?.trim()) {
        alert("Name is required");
        return;
      }
      if (!mobile.trim()) { 
        alert("Mobile number is required");
        return;
      }
  
      //Save user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        phone: user.phoneNumber,
        createdAt: new Date(),
      });
  
        console.log("User:", result.user);
        alert("Registered successfully!");
        router.push("/home");
  
      } catch (err) {
        console.error(err);
        alert("Wrong OTP");
      }
    };
  }


  return {
    otp,
    setOtp,
    mobile,
    setMobile,
    confirmationResult,
    loading,
    sendOTP,
    verifyOtp,
  }

}
