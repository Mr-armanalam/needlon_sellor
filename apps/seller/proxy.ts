import { NextRequest, NextResponse } from "next/server";

import { verifyAccessToken } from "@/modules/auth/lib/tokens";
import {
  ACCESS_COOKIE,
  PUBLIC_ROUTES,
  REFRESH_COOKIE,
  isAdminRoute,
  isAuthRoute,
  isProtectedRoute,
} from "@/modules/auth/lib/auth-config";

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

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const payload = accessToken ? await verifyAccessToken(accessToken) : null;
  const authenticated = !!payload;
  const role = payload?.role ?? null;
  const hasRefreshToken = !!request.cookies.get(REFRESH_COOKIE)?.value;

  if (isAdminRoute(pathname)) {
    if (!authenticated) {
      if (hasRefreshToken) {
        return NextResponse.next();
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (isAuthRoute(pathname)) {
    if (!authenticated) {
      return NextResponse.next();
    }

    const destination = role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (isProtectedRoute(pathname) && !authenticated && !hasRefreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|.*\\..*).*)",
  ],
};
