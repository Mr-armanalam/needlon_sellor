
import { db } from "@/db";
import { seller, sessions } from "@/db/schema/seller";
import { verifyOtp } from "@/modules/auth/lib/otp";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, code, newPassword } = await req.json();

  const result = await verifyOtp(`reset:${email}`, code);
  if (!result.valid) return NextResponse.json({ error: result.error }, { status: 401 });

  if (newPassword.length < 12) {
    return NextResponse.json({ error: "Password must be at least 12 characters." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.update(seller).set({ passwordHash }).where(eq(seller.email, email));

  // Invalidate all existing sessions for this user
  // await db.update(sessions)
  //   .set({ revokedAt: new Date() })
  //   .where(eq(sessions.sellerId, /* userId */));

  return NextResponse.json({ message: "Password updated. Please log in again." });
}