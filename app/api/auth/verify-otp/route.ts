import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { seller } from "@/db/schema/seller";

import { verifyOtp } from "@/modules/auth/lib/otp";
import { verifyOtpSchema } from "@/modules/auth/validations/verify-otp-schema";
import { createPasswordResetToken } from "@/modules/auth/lib/password-reset";

import { limitVerifyOtp } from "@/modules/auth/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
        },
        {
          status: 400,
        },
      );
    }

    const { email, code, type } = parsed.data;

    const allowed = await limitVerifyOtp(email);

    if (!allowed) {
      return NextResponse.json(
        {
          error: "Too many verification attempts.",
        },
        {
          status: 429,
        },
      );
    }

    const result = await verifyOtp(email, code, type);

    if (!result.valid) {
      return NextResponse.json(
        {
          error: result.error,
        },
        {
          status: 401,
        },
      );
    }

    if (type === "signup") {
      const existingSeller = await db.query.sellers.findFirst({
        where: eq(seller.email, email),
      });

      if (!existingSeller) {
        return NextResponse.json(
          {
            error: "Invalid verification request",
          },
          {
            status: 401,
          },
        );
      }

      if (!existingSeller.emailVerified) {
        await db
          .update(seller)
          .set({
            emailVerified: true,
            updatedAt: new Date(),
          })
          .where(eq(seller.email, email));
      }
    }

    if (type === "reset") {
      const existingSeller = await db.query.sellers.findFirst({
        where: eq(seller.email, email),
      });

      if (!existingSeller) {
        return NextResponse.json(
          {
            error: "Invalid reset request",
          },
          {
            status: 401,
          },
        );
      }

      const resetToken = await createPasswordResetToken(existingSeller.id);

      return NextResponse.json({
        success: true,
        type: "reset",
        resetToken,
      });
    }

    return NextResponse.json({
      success: true,
      type,
      message:
        type === "signup"
          ? "Email verified successfully"
          : "OTP verified successfully",
    });
  } catch (error) {
    console.error("VERIFY_OTP_ERROR", error);

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
