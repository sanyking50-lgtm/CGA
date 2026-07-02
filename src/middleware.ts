import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
const secret = JWT_SECRET ? new TextEncoder().encode(JWT_SECRET) : null;

// Routes that require authentication
const PROTECTED_PATHS = ["/dashboard", "/api/admin", "/checkout"];
// Routes that should redirect to dashboard if already logged in
const AUTH_PATHS = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("cga_access_token")?.value;

  // Check if accessing a protected route
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // For protected routes — verify token
  if (isProtected) {
    if (!accessToken || !secret) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(accessToken, secret);
      // Token valid — allow through
      return NextResponse.next();
    } catch {
      // Token expired or invalid — try refresh
      const refreshToken = request.cookies.get("cga_refresh_token")?.value;
      if (!refreshToken) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Redirect to refresh endpoint
      const refreshUrl = new URL("/api/auth/refresh", request.url);
      refreshUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(refreshUrl);
    }
  }

  // For auth pages — redirect to dashboard if already logged in
  if (isAuthPage && accessToken && secret) {
    try {
      await jwtVerify(accessToken, secret);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch {
      // Token invalid — allow auth page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*", "/checkout/:path*", "/login", "/register"],
};