import { cookies } from "next/headers";
import { eq, ne, and } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { sessions } from "@/db/schema/seller";

import {
  blocklistToken,
  getAccessTokenPayload,
} from "@/modules/auth/lib/tokens";

import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";

export async function POST() {
  try {
    const seller = await getCurrentSeller();

    if (!seller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieStore = await cookies();

    const currentSessionId = cookieStore.get("session_id")?.value;

    await db
      .update(sessions)
      .set({
        revokedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(sessions.sellerId, seller.id),
          ne(sessions.id, currentSessionId ?? ""),
        ),
      );

    const accessToken = cookieStore.get("access_token")?.value;

    if (accessToken) {
      const payload = await getAccessTokenPayload(accessToken);

      if (payload?.jti && payload.exp) {
        const ttl = Math.max(payload.exp - Math.floor(Date.now() / 1000), 1);

        await blocklistToken(payload.jti, ttl);
      }
    }

    await db
      .update(sessions)
      .set({
        revokedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, currentSessionId!));

    cookieStore.set("access_token", "", {
      expires: new Date(0),
      path: "/",
    });

    cookieStore.set("refresh_token", "", {
      expires: new Date(0),
      path: "/",
    });

    cookieStore.set("session_id", "", {
      expires: new Date(0),
      path: "/",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("LOGOUT_ALL_ERROR", error);

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
