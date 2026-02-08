"use client";

import { useState } from "react";
import { auth, db, generateRecaptcha } from "@/lib/firebase/firebase";
import { signInWithPhoneNumber, ConfirmationResult, User } from "firebase/auth";


type AuthMode = "login" | "register";

interface OTPResult {
  success: boolean;
  user?: User;
  error?: any;
}

export function useOTPAuth(authMode: AuthMode) {
  const [otp, setOtp] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [name , setName] = useState<string>("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [nameErr , setNameErr] = useState<string | null>(null);
  const [numErr , setNumErr] = useState<string | null>(null);


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
 const sendOTP = async (): Promise<OTPResult> => {
  if (authMode === "register") {
    if (!name.trim() || name.length < 3) {
      setNameErr("Enter Full Name / पूरा नाम डालें");
      return { success: false };
    }
  }

  try {
    setLoading(true);

    const recaptcha = await generateRecaptcha();
    if (!recaptcha) throw new Error("Recaptcha not ready");

    const clean = extractMobile(mobile);
    if (!clean) return { success: false };

    const result = await signInWithPhoneNumber(
      auth,
      "+91" + clean,
      recaptcha
    );

    setConfirmationResult(result);
    return { success: true };

  } catch (err) {
    return { success: false, error: err };
  } finally {
    setLoading(false);
  }
};

  // verify OTP
const verifyOtp = async (): Promise<OTPResult> => {
  if (!confirmationResult) {
    return { success: false, error: "No OTP session" };
  }

  try {
    setLoading(true);

    const result = await confirmationResult.confirm(otp);
    if (!result.user) {
      return { success: false };
    }

    return {
      success: true,
      user: result.user,
    };

  } catch (err) {
    return { success: false, error: err };
  } finally {
    setLoading(false);
  }
};


  const resetAuthState = () => {
  setConfirmationResult(null);
  setOtp("");
  setMobile("");
  setName("");
  setNameErr("");
};


return {
  otp,
  setOtp,
  mobile,
  setMobile,
  name,
  setName,
  confirmationResult,
  loading,
  sendOTP,
  verifyOtp,
  resetAuthState,
  numErr,
  nameErr,
};


}
