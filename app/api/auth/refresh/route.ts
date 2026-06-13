import { cookies } from "next/headers";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
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

    const [session] = await db
      .select({
        id: sessions.id,
        sellerId: sessions.sellerId,
        expiresAt: sessions.expiresAt,
      })
      .from(sessions)
      .where(
        and(
          eq(sessions.refreshToken, refreshTokenHash),
          isNull(sessions.revokedAt),
          gt(sessions.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const [sellerData] = await db
      .select()
      .from(seller)
      .where(eq(seller.id, session.sellerId))
      .limit(1);

    if (!sellerData || !sellerData.emailVerified) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const accessToken = await signAccessToken({
      sub: sellerData.id,
      email: sellerData.email,
    });

    const { raw: newRefreshToken, hash: newRefreshTokenHash } =
      generateRefreshToken();

    await db
      .update(sessions)
      .set({
        refreshToken: newRefreshTokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL * 1000),
        lastRotatedAt: new Date(),
        refreshTokenVersion: sql`${sessions.refreshTokenVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, session.id));

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    };

    cookieStore.set("access_token", accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_TTL,
    });

    cookieStore.set("refresh_token", newRefreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_TTL,
    });

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
