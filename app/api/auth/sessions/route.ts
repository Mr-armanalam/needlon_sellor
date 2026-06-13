import { cookies } from "next/headers";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { sessions } from "@/db/schema/seller";

import { requireSeller } from "@/modules/auth/lib/require-seller";

export async function GET() {
  try {
    const currentSeller = await requireSeller();

    const cookieStore = await cookies();

    const currentSessionId = cookieStore.get("session_id")?.value;

    const rows = await db
      .select({
        id: sessions.id,
        userAgent: sessions.userAgent,
        ipAddress: sessions.ipAddress,
        createdAt: sessions.createdAt,
        updatedAt: sessions.updatedAt,
        expiresAt: sessions.expiresAt,
        lastRotatedAt: sessions.lastRotatedAt,
      })
      .from(sessions)
      .where(
        and(
          eq(sessions.sellerId, currentSeller.id),
          isNull(sessions.revokedAt),
          gt(sessions.expiresAt, new Date()),
        ),
      )
      .orderBy(desc(sessions.updatedAt));

    return NextResponse.json(
      rows.map((row) => ({
        ...row,
        isCurrent: row.id === currentSessionId,
      })),
    );
  } catch (error) {
    console.error("GET_SESSIONS_ERROR", error);

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
