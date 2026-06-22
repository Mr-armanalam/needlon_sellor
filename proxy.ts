import { NextRequest, NextResponse } from "next/server";

import { verifyAccessToken } from "@/modules/auth/lib/tokens";
import {
  ACCESS_COOKIE,
  AUTH_ROUTES,
  PROTECTED_ROUTES,
} from "@/modules/auth/lib/auth-config";

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const PUBLIC_ROUTES = ["/", "/about", "/pricing"];
  console.log(pathname, PUBLIC_ROUTES);
  

  if (pathname === "/" || PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;

  let authenticated = false;

  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);

    authenticated = !!payload;
  }

  /**
   * Guest -> Protected Route
   */
  if (isProtectedRoute(pathname) && !authenticated) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  /**
   * Logged In -> Auth Pages
   */
  if (isAuthRoute(pathname) && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Exclude:
     * - api
     * - _next
     * - favicon
     * - static files
     */
    "/((?!api|_next|favicon.ico|.*\\..*).*)",
  ],
};
