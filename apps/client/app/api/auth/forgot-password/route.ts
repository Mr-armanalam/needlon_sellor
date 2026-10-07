import { NextRequest, NextResponse } from "next/server";
import {
  generateSecureToken,
  getTokenExpiry,
} from "@/modules/auth/forget-password/lib/tokens";
import { sendPasswordResetEmail } from "@/modules/auth/forget-password/lib/email";
import { db } from "@/db";
import { passwordResetTokens } from "@/db/schema/password-reset-tokens";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Valid email is required." },
        { status: 400 },
      );
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email.toLowerCase().trim()),
    });

    //   const [user] = await db
    // .select()
    // .from(usersTable)
    // .where(eq(usersTable.email, email.toLowerCase().trim()))
    // .limit(1);

    if (!user || !user.password) {
      return NextResponse.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // Invalidate any existing unused tokens for this user
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(
        and(
          eq(passwordResetTokens.userId, user.id),
          eq(passwordResetTokens.used, false),
        ),
      );

    const token = generateSecureToken();

    await db.insert(passwordResetTokens).values({
      token,
      userId: user.id,
      expiresAt: getTokenExpiry(1),
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_URL}/auth/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email!, resetUrl);

    return NextResponse.json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("[FORGOT_PASSWORD]", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
