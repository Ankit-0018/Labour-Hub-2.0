import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/firebase-admin";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  const res = NextResponse.json({ success: true });

  // Set session token cookie
  res.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour to match Firebase token expiry
  });

  // Get user role and context to store in separate cookies for Edge Middleware interception
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    const data = userDoc.data();
    
    const role = data?.role || "none";
    const profileCompleted = data?.profileCompleted ? "true" : "false";
    
    res.cookies.set("user_role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    res.cookies.set("profile_completed", profileCompleted, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
  } catch (error) {
    console.error("Error getting user identity claims:", error);
  }

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("session");
  res.cookies.delete("user_role");
  return res;
}
