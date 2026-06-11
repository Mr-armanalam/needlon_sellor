import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyOtp } from "@/modules/auth/lib/otp";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { seller, sessions } from "@/db/schema/seller";
import {
  generateRefreshToken,
  signAccessToken,
} from "@/modules/auth/lib/tokens";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  const result = await verifyOtp(email, code);
  if (!result.valid)
    return NextResponse.json({ error: result.error }, { status: 401 });

  // Upsert user
  let [seller_data] = await db
    .select()
    .from(seller)
    .where(eq(seller.email, email))
    .limit(1);

  if (!seller_data) {
    [seller_data] = await db
      .insert(seller)
      .values({ email, emailVerified: true })
      .returning();
  } else if (!seller.emailVerified) {
    await db
      .update(seller)
      .set({ emailVerified: true })
      .where(eq(seller.email, email));
  }

  // generate tokens
  const accessToken = await signAccessToken({ sub: seller_data.id, email });
  const { raw, hash } = generateRefreshToken();

  await db.insert(sessions).values({
    sellerId: seller_data.id,
    refreshToken: hash,
    userAgent: req.headers.get("user-agent") ?? undefined,
    ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const cookieStore = await cookies();
  const BASE = {
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
    path: "/",
  };
  cookieStore.set("access_token", accessToken, { ...BASE, maxAge: 60 * 15 });
  cookieStore.set("refresh_token", raw, { ...BASE, maxAge: 60 * 60 * 24 * 7 });

  return NextResponse.json({ user: { id: seller_data.id, email } });
}
