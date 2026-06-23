import { cookies } from "next/headers";

import { eq } from "drizzle-orm";

import { db } from "@/db";

import { seller } from "@/db/schema/seller";

import { verifyAccessToken, isTokenBlocklisted } from "./tokens";

import { ACCESS_COOKIE } from "./auth-config";
import { AuthSeller } from "@/types/auth";
import { cache } from "react";

export const getCurrentSeller = cache(async (): Promise<AuthSeller | null> => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  const payload = await verifyAccessToken(accessToken);

  if (!payload) {
    return null;
  }

  // Authoritative blocklist check — unlike the middleware, this path is reached
  // by every real data request, so the Redis round-trip is justified here.

  const blocked = await isTokenBlocklisted(payload.jti);

  if (blocked) {
    return null;
  }

  const result = await db
    .select({
      id: seller.id,
      name: seller.name,
      email: seller.email,
      emailVerified: seller.emailVerified,
      role: seller.role,
    })
    .from(seller)
    .where(eq(seller.id, payload.sub))
    .limit(1);

  // Role is re-read from the DB on every authenticated data request.
  // This means a role change takes effect immediately for data access,
  // even though the middleware still reads the (potentially stale) JWT
  // role until the token rotates.

  return result[0] ?? null;
});
