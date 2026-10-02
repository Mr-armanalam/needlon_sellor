import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { seller } from "@/db/schema/seller";

import { createOtp } from "@/modules/auth/lib/otp";
import { sendResetEmail } from "@/modules/auth/lib/email";
import { limitForgotPassword } from "@/modules/auth/lib/rate-limit";
import { forgotPasswordSchema } from "@/modules/auth/validations/forgot-password";

const GENERIC_RESPONSE = {
  message: "If an account exists, a reset code has been sent.",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          issues: parsed.error.issues,
        },
        {
          status: 400,
        },
      );
    }
    const data = parsed.data;

    const email = data?.email?.trim()?.toLowerCase();

    if (!email) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    const allowed = await limitForgotPassword(email);

    if (!allowed) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    const existingSeller = await db.query.sellers.findFirst({
      where: eq(seller.email, email),
    });

    /**
     * Prevent email enumeration.
     */
    if (!existingSeller || !existingSeller.emailVerified) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    const otp = await createOtp(email, "reset");

    if ("error" in otp) {
      return NextResponse.json(
        {
          error: otp.error,
        },
        {
          status: 429,
        },
      );
    }

    await sendResetEmail(email, otp.code);

    return NextResponse.json(GENERIC_RESPONSE);
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
