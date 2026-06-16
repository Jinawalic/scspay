import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "scspay_admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is an admin route
  if (pathname.startsWith("/admin")) {
    // Allow access to the login page
    if (pathname === "/admin") {
      return NextResponse.next();
    }

    // Check for admin session cookie
    const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE);

    if (!sessionCookie || !sessionCookie.value) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/admin", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
