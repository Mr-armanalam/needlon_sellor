import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { passwordResetTokens } from "@/db/schema/password-reset-tokens";
import { usersTable } from "@/db/schema/users";
import { eq } from "drizzle-orm";

const MIN_PASSWORD_LENGTH = 8;

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required." },
        { status: 400 },
      );
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        {
          message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
        },
        { status: 400 },
      );
    }

    // Find token with user
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .innerJoin(usersTable, eq(passwordResetTokens.userId, usersTable.id))
      .where(eq(passwordResetTokens.token, token))
      .limit(1);

    if (!resetToken) {
      return NextResponse.json(
        { message: "Invalid or expired reset link." },
        { status: 400 },
      );
    }

    // Validate
    if (
      !resetToken ||
      resetToken.password_reset_tokens.used ||
      resetToken.password_reset_tokens.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { message: "This reset link has expired or already been used." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and mark token as used atomically
    await db.transaction(async (tx) => {
      await tx
        .update(usersTable)
        .set({ password: hashedPassword })
        .where(eq(usersTable.id, resetToken.password_reset_tokens.userId));

      await tx
        .update(passwordResetTokens)
        .set({ used: true })
        .where(eq(passwordResetTokens.id, resetToken.password_reset_tokens.id));
    });

    return NextResponse.json({
      message: "Password reset successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("[RESET_PASSWORD]", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
