import { z } from "zod";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { roleEnum, seller } from "@/db/schema/seller";

import { createOtp } from "@/modules/auth/lib/otp";
import { sendOtpEmail } from "@/modules/auth/lib/email";

import { signupRequestSchema } from "@/modules/auth/validations/signup-request-schema";

const apiSignupSchema = signupRequestSchema.extend({
  role: z.enum(roleEnum.enumValues).default("seller"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = apiSignupSchema.safeParse(body);

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

    const { name, email, password, role } = parsed.data;

    const existingSeller = await db.query.sellers.findFirst({
      where: eq(seller.email, email),
    });

    if (existingSeller) {
      if (existingSeller.emailVerified) {
        return NextResponse.json(
          {
            error: "An account already exists with this email.",
          },
          {
            status: 409,
          },
        );
      }

      const otp = await createOtp(email, "signup");

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

      await sendOtpEmail(email, otp.code);

      return NextResponse.json({
        success: true,
      });
    }

    const passwordHash = await hash(password, 12);

    await db.insert(seller).values({
      name,
      email,
      passwordHash,
      emailVerified: false,
      role,
    });

    const otp = await createOtp(email, "signup");

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

    await sendOtpEmail(email, otp.code);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("SIGNUP_ERROR", error);

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
