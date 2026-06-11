import { db } from "@/db";
import { seller } from "@/db/schema/seller";
import { sendResetEmail } from "@/modules/auth/lib/email";
import { createOtp } from "@/modules/auth/lib/otp";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const [seller_data] = await db.select().from(seller).where(eq(seller.email, email)).limit(1);

  // Always return 200 to prevent email enumeration
  if (!seller_data) return NextResponse.json({ message: "If that email exists, you'll receive an OTP." });

  const result = await createOtp(`reset:${email}`); // namespace prevents OTP reuse
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 429 });

  await sendResetEmail(email, result.code);
  return NextResponse.json({ message: "If that email exists, you'll receive an OTP." });
}
