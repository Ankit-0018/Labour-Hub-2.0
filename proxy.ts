import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  const role = req.cookies.get("user_role")?.value;
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  if (!token) {
    if (pathname !== "/auth") {
      return NextResponse.redirect(new URL("/auth?mode=login", req.url));
    }
    return NextResponse.next();
  }

  if (!role || role === "null" || role === "none") {
    if (pathname !== "/choose-role") {
      return NextResponse.redirect(new URL("/choose-role", req.url));
    }
    return NextResponse.next();
  }

  if (role) {
    if (pathname === "/auth" || pathname === "/choose-role" || pathname === "/") {
      return NextResponse.redirect(
        new URL(
          role === "worker" ? "/worker/home" : "/employer/home",
          req.url
        )
      );
    }

    if (role === "worker" && pathname.startsWith("/employer")) {
      return NextResponse.redirect(new URL("/worker/home", req.url));
    }

    if (role === "employer" && pathname.startsWith("/worker")) {
      return NextResponse.redirect(new URL("/employer/home", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)",
  ],
};
