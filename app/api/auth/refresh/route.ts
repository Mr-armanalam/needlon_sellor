// src/app/api/auth/refresh/route.ts
import { db } from "@/db";
import { seller, sessions } from "@/db/schema/seller";
import {
  generateRefreshToken,
  signAccessToken,
} from "@/modules/auth/lib/tokens";
import { createHash } from "crypto";
import { eq, and, isNull, gt } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const rawRefresh = cookieStore.get("refresh_token")?.value;
  if (!rawRefresh) return new Response("Unauthorized", { status: 401 });

  const hash = createHash("sha256").update(rawRefresh).digest("hex");

  // Find valid session
  const [session] = await db
    .select({
      id: sessions.id,
      sellerId: sessions.sellerId,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .where(
      and(
        eq(sessions.refreshToken, hash),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!session) return new Response("Unauthorized", { status: 401 });

  const [seller_data] = await db
    .select()
    .from(seller)
    .where(eq(seller.id, session.sellerId))
    .limit(1);
  if (!seller_data) return new Response("Unauthorized", { status: 401 });

  // Rotate refresh token (prevents replay)
  const { raw: newRaw, hash: newHash } = generateRefreshToken();
  await db
    .update(sessions)
    .set({
      refreshToken: newHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    .where(eq(sessions.id, session.id));

  const accessToken = await signAccessToken({
    sub: seller_data.id,
    email: seller_data.email,
  });

  const cookieStore2 = await cookies();
  const BASE = {
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
    path: "/",
  };
  cookieStore2.set("access_token", accessToken, { ...BASE, maxAge: 60 * 15 });
  cookieStore2.set("refresh_token", newRaw, {
    ...BASE,
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({ ok: true });
}
