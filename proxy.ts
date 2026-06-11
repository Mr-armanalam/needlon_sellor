// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_SECRET  = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
const PUBLIC_ROUTES  = ["/", "/login", "/api/auth/send-otp", "/api/auth/verify-otp", "/api/auth/refresh"];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (PUBLIC_ROUTES.some(r => path.startsWith(r))) return NextResponse.next();

  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    // Try to refresh silently before redirecting
    const refreshRes = await fetch(new URL("/api/auth/refresh", req.url), {
      method: "POST",
      headers: { cookie: req.headers.get("cookie") ?? "" },
    });
    if (!refreshRes.ok) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Re-forward with new cookies
    const res = NextResponse.next();
    refreshRes.headers.getSetCookie().forEach(c => res.headers.append("set-cookie", c));
    return res;
  }

  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    const res = NextResponse.next();
    res.headers.set("x-user-id", payload.sub as string);
    return res;
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };