"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";



export async function logout() {
  try {
    await signOut(auth);
    console.log("User logged out successfully")
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}
