import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserRole, verifySession } from "./lib/utils/auth";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  const pathname = req.nextUrl.pathname;

  // Not logged in
  if (!token) {
    if (
      pathname.startsWith("/worker") ||
      pathname.startsWith("/employer") ||
      pathname === "/choose-role" ||
      pathname !== "/auth"
    ) {
      return NextResponse.redirect(new URL("/auth?mode=login", req.url));
    }
    return NextResponse.next();
  }
//  Verify Firebase token 🔐
  const decoded = await verifySession(token);

  if (!decoded) {
    return NextResponse.redirect(new URL("/auth?mode=login", req.url));
  }

  const uid = decoded.uid;

  const role = await getUserRole(uid);
  // Logged in but role not chosen
  if (token && (!role || role === "null")) {
    if (pathname !== "/choose-role") {
      return NextResponse.redirect(new URL("/choose-role", req.url));
    }
    return NextResponse.next();
  }

  if(token && role) {
    if (pathname === "/choose-role") {
      return NextResponse.redirect(
        new URL(
          role === "worker"
            ? "/worker/home"
            : "/employer/home",
          req.url
        )
      );
    }
  }

  // Role-based protection
  if (role === "worker" && pathname.startsWith("/employer")) {
    return NextResponse.redirect(new URL("/worker/home", req.url));
  }

  if (role === "employer" && pathname.startsWith("/worker")) {
    return NextResponse.redirect(new URL("/employer/home", req.url));
  }

  // Prevent auth pages when logged in
  if (pathname.startsWith("/auth")) {
    return NextResponse.redirect(
      new URL(
        role === "worker"
          ? "/worker/home"
          : "/employer/home",
        req.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
