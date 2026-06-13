import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { sessions } from "@/db/schema/seller";

import {
  blocklistToken,
  getAccessTokenPayload,
  hashRefreshToken,
} from "@/modules/auth/lib/tokens";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("access_token")?.value;

    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (accessToken) {
      const payload = await getAccessTokenPayload(accessToken);

      if (payload?.jti && payload.exp) {
        const ttl = Math.max(payload.exp - Math.floor(Date.now() / 1000), 1);

        await blocklistToken(payload.jti, ttl);
      }
    }

    if (refreshToken) {
      const refreshTokenHash = hashRefreshToken(refreshToken);

      await db
        .update(sessions)
        .set({
          revokedAt: new Date(),

          updatedAt: new Date(),
        })
        .where(eq(sessions.refreshToken, refreshTokenHash));
    }

    cookieStore.set("access_token", "", {
      expires: new Date(0),
      path: "/",
    });

    cookieStore.set("refresh_token", "", {
      expires: new Date(0),
      path: "/",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("LOGOUT_ERROR", error);

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
