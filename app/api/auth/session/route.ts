import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  const res = NextResponse.json({ success: true });

  res.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour to match Firebase token expiry
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("session");
  return res;
}
