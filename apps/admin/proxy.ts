import { NextRequest, NextResponse } from "next/server";

import { verifyAccessToken } from "@/modules/auth/lib/tokens";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
} from "@/modules/auth/lib/auth-config";

// Admin-app session guard. Every page in this app requires an admin
// session: unauthenticated requests are bounced to /login, and an
// already-authenticated admin visiting /login is sent to the console.
// The role itself is enforced authoritatively by the (console) layout
// (getCurrentSeller) and by requireAdmin() in every /api/admin handler —
// /api routes are outside this matcher and guard themselves.

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const payload = accessToken ? await verifyAccessToken(accessToken) : null;
  const authenticated = !!payload;
  const hasRefreshToken = !!request.cookies.get(REFRESH_COOKIE)?.value;

  if (pathname === "/login") {
    if (authenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!authenticated && !hasRefreshToken) {
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
