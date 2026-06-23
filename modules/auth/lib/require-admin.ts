import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

import { getCurrentSeller } from "./get-current-seller";
import { AuthSeller } from "@/types/auth";

//  Return shapes 
type AdminGuardSuccess = {
  seller: AuthSeller & { role: "admin" };
  error: null;
};
type AdminGuardFailure = { seller: null; error: NextResponse };

export type AdminGuardResult = AdminGuardSuccess | AdminGuardFailure;

//  requireAdmin 
// Use this at the top of every Route Handler or Server Action that is
// admin-only. It returns a discriminated union so TypeScript narrows the role
// inside the success branch — you never need to re-check `seller.role` after
// a successful guard.
//
// Usage in a Route Handler:
//
//   const { seller, error } = await requireAdmin();
//   if (error) return error;
//   // seller.role is "admin" here — TypeScript knows this.
//
// This approach avoids the `redirect()` anti-pattern inside Route Handlers
// (which produces a redirect response rather than a parseable JSON error).
// All failures return structured JSON with the correct HTTP status code.
export async function requireAdmin(): Promise<AdminGuardResult> {
  const current = await getCurrentSeller();

  // Not authenticated at all → 401
  if (!current) {
    return {
      seller: null,
      error: NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      ),
    };
  }

  // Authenticated but not an admin → 403
  // 403 (not 404) is correct here: the resource exists, the caller is just not
  // allowed to access it. Returning 404 to hide admin endpoints is security
  // through obscurity — rate-limited 403s are preferable and honest.
  if (current.role !== "admin") {
    return {
      seller: null,
      error: NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 },
      ),
    };
  }

  return {
    seller: current as AuthSeller & { role: "admin" },
    error: null,
  };
}
