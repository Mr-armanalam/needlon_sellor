
import { cookies } from "next/headers";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { blocklistToken, verifyAccessToken } from "@/modules/auth/lib/tokens";
import { db } from "@/db";
import { sessions } from "@/db/schema/seller";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken  = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  // Blocklist the access JTI in Redis (TTL = remaining token lifetime ~15m)
  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload?.jti) await blocklistToken(payload.jti, 60 * 15);
  }

  // Revoke the refresh session
  if (refreshToken) {
    const hash = createHash("sha256").update(refreshToken).digest("hex");
    await db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.refreshToken, hash));
  }

  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  return NextResponse.json({ ok: true });
}