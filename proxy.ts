import { NextRequest, NextResponse } from "next/server";

import { verifyAccessToken } from "@/modules/auth/lib/tokens";
import {
  ACCESS_COOKIE,
  ADMIN_ROUTES,
  AUTH_ROUTES,
  PROTECTED_ROUTES,
} from "@/modules/auth/lib/auth-config";

// Route classifiers
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

// Middleware
// 1. No blocklist check — by design. A Redis round-trip on every page
//    navigation would add ~10–30 ms to every render. The blocklist is checked
//    by getCurrentSeller() / requireSeller() / requireAdmin() for every request
//    that actually touches data, so no real data is ever exposed. The only
//    observable gap is that a blocklisted-but-unexpired access token can still
//    render a page *shell* for up to 15 minutes; the shell will be empty of
//    real data because the data-fetching layer rejects it.
//
// 2. Role check reads from the JWT — not the DB. Role is embedded in the token
//    at login time. The DB is the authoritative source; if a role changes mid-
//    session, it takes effect on the next token refresh (≤ 15 min). For admin
//    role changes, revoke the session immediately after updating the DB row.

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const PUBLIC_ROUTES = ["/", "/about", "/pricing"];

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Decode token (no DB/Redis)
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;

  const payload = accessToken ? await verifyAccessToken(accessToken) : null;
  const authenticated = !!payload;
  const role = payload?.role ?? null;

  // Admin route
  // Layer 1: must be authenticated at all.
  // Layer 2: must hold the "admin" role.
  // Sellers are redirected to /dashboard (not /login) because they ARE logged
  // in — this is an authorisation failure, not an authentication failure. A
  // /login redirect would be confusing UX for a valid seller.

  if (isAdminRoute(pathname)) {
    if (!authenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== "admin") {
      // Authenticated seller trying to reach an admin page → /dashboard.
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  //Seller-protected routes
  if (isProtectedRoute(pathname) && !authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /**
   * Guest -> Protected Route
   */
  if (isProtectedRoute(pathname) && !authenticated) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Auth pages (Login or Signup)
  // Redirect any authenticated user — regardless of role — away from auth pages.

  if (isAuthRoute(pathname) && authenticated) {
    const destination = role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|.*\\..*).*)",
  ],
};
