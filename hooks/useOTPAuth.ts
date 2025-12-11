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
  const [nameErr , setNameErr] = useState<string | null>(null);
  const [numErr , setNumErr] = useState<string | null>(null);
  //extracting mobile number 

// Extract & validate Indian mobile number
const extractMobile = (input: string): string | null => {
  setNumErr(null); // Clear old errors
  let m = input.trim().replace(/\D/g, ""); // remove spaces, +, -, etc.
  if (!m) {
    setNumErr("Required / आवश्यक");
    return null;
  }
  // remove 91, +91, 0
  if (m.startsWith("91")) m = m.slice(2);
  if (m.startsWith("0")) m = m.slice(1);
  if (m.length !== 10) {
    setNumErr("Must be 10 digits / 10 अंक");
    return null;
  }
  if (!/^[6-9]\d{9}$/.test(m)) {
    setNumErr("Invalid number / गलत नंबर");
    return null;
  }
  return m; // VALID
};

  //send OTP
  const sendOTP = async (e: React.FormEvent): Promise<OTPResult> => {
    if(role !== "login" && role == "register"){
      //basic validation
      if (!name?.trim() || name.length < 3) {
        setNameErr("Enter Full Name/पुरा नाम डाले.");
        return { success: false, error: nameErr };
      }
    }

    try {
      e.preventDefault();
      setLoading(true);
      //fetch user data to check if user exists or not (optional for now)  
      const recaptcha = await generateRecaptcha();
      if (!recaptcha) {
        throw new Error("Recaptcha not initialized");
      }
      const clean = extractMobile(mobile); // makes 10 digit
      if (!clean) {
        return { success: false, error: numErr };
      }
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
    setLoading(true);
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
            router.push("/auth?mode=register");
            resetAuthState();
            return;
          }
            router.push("/home");
          } catch (err) {
            console.error(err);
            alert("Wrong OTP");
          }finally {
            setLoading(false)
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
        router.push("/auth?mode=login");
        resetAuthState();
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
      } finally {
            setLoading(false)
          }
    };
  }

  const resetAuthState = () => {
  setConfirmationResult(null);
  setOtp("");
  setMobile("");
  setName("");
  setNameErr("");
  setNameErr("");
};



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
    role,
    resetAuthState,
    numErr,
    nameErr
    
  }

}
