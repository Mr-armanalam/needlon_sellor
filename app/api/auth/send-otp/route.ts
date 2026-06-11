// src/app/api/auth/send-otp/route.ts
import { sendOtpEmail } from "@/modules/auth/lib/email";
import { createOtp } from "@/modules/auth/lib/otp";
import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const { email } = body.data;
  const result = await createOtp(email);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 429 });

  await sendOtpEmail(email, result.code);
  return NextResponse.json({ message: "OTP sent" });
}
