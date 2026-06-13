import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";

import { seller, sessions } from "@/db/schema/seller";
import { consumePasswordResetToken } from "@/modules/auth/lib/password-reset";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const token = body?.token;

    const password = body?.password;

    if (!token || !password) {
      return NextResponse.json(
        {
          error: "Invalid request",
        },
        {
          status: 400,
        },
      );
    }

    const sellerId = await consumePasswordResetToken(token);

    if (!sellerId) {
      return NextResponse.json(
        {
          error: "Reset link expired",
        },
        {
          status: 401,
        },
      );
    }

    const passwordHash = await hash(password, 12);

    await db
      .update(seller)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(seller.id, sellerId));

    await db
      .update(sessions)
      .set({
        revokedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(sessions.sellerId, sellerId));

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR", error);

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
