import { cookies } from "next/headers";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { sessions } from "@/db/schema/seller";

import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import {
  parseUserAgent,
  formatRelativeTime,
  formatDateString,
} from "@/modules/logout/lib/logout-service";

export async function GET() {
  try {
    const currentSeller = await getCurrentSeller();

    if (!currentSeller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      rows.map((row) => {
        const parsed = parseUserAgent(row.userAgent);
        const rawIp = row.ipAddress || "192.168.1.1";
        const maskedIp = rawIp.includes(".")
          ? rawIp.split(".").slice(0, 3).join(".") + ".***"
          : rawIp;

        return {
          ...row,
          deviceName: parsed.deviceName,
          os: parsed.os,
          browser: parsed.browser,
          location: "Active Location",
          ip: maskedIp,
          loginTime: formatDateString(new Date(row.createdAt)),
          lastActive: formatRelativeTime(new Date(row.updatedAt)),
          isCurrent: Boolean(currentSessionId && row.id === currentSessionId),
          isTrusted: true,
        };
      }),
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
