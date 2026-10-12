import { cookies } from "next/headers";
import { and, eq, gt, isNull, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { seller, sessions } from "@/db/schema/seller";

import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  generateRefreshToken,
  hashRefreshToken,
  signAccessToken,
} from "@/modules/auth/lib/tokens";

const REFRESH_TOKEN_GRACE_PERIOD_SECONDS = 30;

export async function POST() {
  try {
    const cookieStore = await cookies();

    const rawRefreshToken = cookieStore.get("refresh_token")?.value;

    if (!rawRefreshToken) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const refreshTokenHash = hashRefreshToken(rawRefreshToken);
    const now = new Date();

    const refreshedSession = await db.transaction(async (transaction) => {
      const [session] = await transaction
        .select({
          id: sessions.id,
          sellerId: sessions.sellerId,
          refreshToken: sessions.refreshToken,
        })
        .from(sessions)
        .where(
          and(
            or(
              eq(sessions.refreshToken, refreshTokenHash),
              and(
                eq(sessions.previousRefreshToken, refreshTokenHash),
                gt(sessions.previousRefreshTokenExpiresAt, now),
              ),
            ),
            isNull(sessions.revokedAt),
            gt(sessions.expiresAt, now),
          ),
        )
        .for("update")
        .limit(1);

      if (!session) return null;

      const [sellerData] = await transaction
        .select()
        .from(seller)
        .where(eq(seller.id, session.sellerId))
        .limit(1);

      if (!sellerData || !sellerData.emailVerified) return null;

      const accessToken = await signAccessToken({
        sub: sellerData.id,
        email: sellerData.email,
        role: sellerData.role,
      });

      if (session.refreshToken !== refreshTokenHash) {
        return { accessToken, refreshToken: null };
      }

      const { raw: newRefreshToken, hash: newRefreshTokenHash } =
        generateRefreshToken();

      await transaction
        .update(sessions)
        .set({
          previousRefreshToken: session.refreshToken,
          previousRefreshTokenExpiresAt: new Date(
            now.getTime() + REFRESH_TOKEN_GRACE_PERIOD_SECONDS * 1000,
          ),
          refreshToken: newRefreshTokenHash,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL * 1000),
          lastRotatedAt: now,
          refreshTokenVersion: sql`${sessions.refreshTokenVersion} + 1`,
          updatedAt: now,
        })
        .where(eq(sessions.id, session.id));

      return { accessToken, refreshToken: newRefreshToken };
    });

    if (!refreshedSession) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    };

    cookieStore.set("access_token", refreshedSession.accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_TTL,
    });

    if (refreshedSession.refreshToken) {
      cookieStore.set("refresh_token", refreshedSession.refreshToken, {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_TTL,
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("REFRESH_ERROR", error);

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
