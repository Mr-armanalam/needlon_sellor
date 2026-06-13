import { db } from "@/db";
import { seller } from "@/db/schema/seller";
import { sendOtpEmail, sendResetEmail } from "@/modules/auth/lib/email";
import { createOtp } from "@/modules/auth/lib/otp";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

const schema = z.object({ email: z.email(), type: z.string().nullable() });

export async function POST(req: NextRequest) {
  const body = schema.safeParse(await req.json());
  if (!body.success)
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const { email, type } = body.data;
  const [seller_data] = await db
    .select()
    .from(seller)
    .where(eq(seller.email, email))
    .limit(1);

  const otpType = type === "reset" ? "reset" : "signup";

  const result = await createOtp(email, otpType);
  if ("error" in result)
    return NextResponse.json({ error: result.error }, { status: 429 });

  if (type === "reset" && seller_data) {
    await sendResetEmail(email, result.code);
  } else if (seller_data && type === "signin") {
    await sendOtpEmail(email, result.code);
  } else {
    return NextResponse.json(
      { error: "Unauthorised acccess" },
      { status: 401 },
    );
  }
  return NextResponse.json({ message: "OTP sent successfully" });
}
