"use client";

import { useState } from "react";
import { auth, db, generateRecaptcha } from "@/lib/firebase";
import { signInWithPhoneNumber, ConfirmationResult, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {useRouter} from "next/navigation";
import { logout } from "@/lib/auth/logout";

interface OTPResult {
  success: boolean;
  user?: User;
  error?: any;
}

export function useOTPAuth() {
  const [otp, setOtp] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [name , setName] = useState<string>("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [role , setRole] = useState<string>("");
  const router = useRouter();

  //extracting mobile number 
  const extractMobile = (m: string) => {
    m = m.trim().replace(/\D/g, "");

    // remove +91 or 91
    if (m.startsWith("91")) m = m.slice(2);
    if (m.startsWith("0")) m = m.slice(1);

    if (m.length !== 10) throw new Error("Invalid mobile number");
    return m;
  };

  //send OTP
  const sendOTP = async (e: React.FormEvent): Promise<OTPResult> => {
    try {
      e.preventDefault();
      setLoading(true);
      //fetch user data to check if user exists or not (optional for now)  
      const recaptcha = await generateRecaptcha();
      if (!recaptcha) {
        throw new Error("Recaptcha not initialized");
      }
      const clean = extractMobile(mobile); // makes 10 digit
      const finalNumber = "+91" + clean; // always add +91
      console.log("Sending OTP to:", finalNumber);
      const result = await signInWithPhoneNumber(auth, finalNumber, recaptcha);
      setConfirmationResult(result);
      console.log("result", result);
      return { success: true };
    } catch (err) {
      alert("Failed to send OTP. Please try again.");
      console.error("sendOTP error:", err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // verify OTP
  const verifyOtp = async (e : React.FormEvent) => {
    e.preventDefault();
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
            await logout();
            alert("No account found. Please register first.");
            return;
          }
            router.push("/home");
          } catch (err) {
            console.error(err);
            alert("Wrong OTP");
          }
    } else {
      try {
        const result = await confirmationResult?.confirm(otp);
        console.log("OTP verified successfully" , result);
        const user = result?.user; // Firebase Auth user
        if(!user){
          throw new Error("OTP verification failed");
        }   
      //check if user already exists
      const userRef = doc(db, "users", user?.uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        await logout();
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
    name,
    setName,
    setRole,
    role
  }

}
