import { compare, hash } from "bcryptjs";
import { eq, and, ne, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { seller, sessions } from "@/db/schema/seller";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
    revokeOtherSessions: z.boolean().optional().default(false),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation do not match",
    path: ["confirmPassword"],
  });

export async function POST(req: NextRequest) {
  try {
    const currentSeller = await getCurrentSeller();

    if (!currentSeller) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || "Invalid input",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword, revokeOtherSessions } = parsed.data;

    // Fetch existing seller with passwordHash
    const [sellerRecord] = await db
      .select({
        id: seller.id,
        passwordHash: seller.passwordHash,
      })
      .from(seller)
      .where(eq(seller.id, currentSeller.id))
      .limit(1);

    if (!sellerRecord) {
      return NextResponse.json(
        { error: "Seller account not found" },
        { status: 404 }
      );
    }

    // Verify current password if one exists
    if (sellerRecord.passwordHash) {
      const isValid = await compare(currentPassword, sellerRecord.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }
    }

    // Hash new password
    const newPasswordHash = await hash(newPassword, 12);

    // Update seller record
    await db
      .update(seller)
      .set({
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      })
      .where(eq(seller.id, currentSeller.id));

    // Invalidate other sessions if requested
    if (revokeOtherSessions) {
      const cookieStore = await cookies();
      const currentSessionId = cookieStore.get("session_id")?.value;

      if (currentSessionId) {
        await db
          .update(sessions)
          .set({
            revokedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(sessions.sellerId, currentSeller.id),
              ne(sessions.id, currentSessionId),
              isNull(sessions.revokedAt)
            )
          );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("CHANGE_PASSWORD_ERROR", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
