import { compare } from "bcryptjs";
import { and, asc, eq, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { seller, sessions } from "@/db/schema/seller";

import {
  generateRefreshToken,
  signAccessToken,
} from "@/modules/auth/lib/tokens";

import { loginRequestSchema } from "@/modules/auth/validations/login-request-schema";

import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "@/modules/auth/lib/tokens";

import { getClientIp } from "@/modules/auth/lib/request";

import { limitLogin } from "@/modules/auth/lib/rate-limit";

const MAX_ACTIVE_SESSIONS = 2;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = loginRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        {
          status: 400,
        },
      );
    }

    const { email, password } = parsed.data;

    const ip = getClientIp(req);

    const allowed = await limitLogin(ip, email);

    if (!allowed) {
      return NextResponse.json(
        {
          error: "Too many login attempts. Please try again later.",
        },
        {
          status: 429,
        },
      );
    }

    const existingSeller = await db.query.sellers.findFirst({
      where: eq(seller.email, email),
    });

    /**
     * Generic response.
     * Prevents account enumeration.
     */
    if (!existingSeller || !existingSeller.passwordHash) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        {
          status: 401,
        },
      );
    }

    const passwordValid = await compare(password, existingSeller.passwordHash);

    if (!passwordValid) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        {
          status: 401,
        },
      );
    }

    if (!existingSeller.emailVerified) {
      return NextResponse.json(
        {
          error: "Please verify your email address before logging in.",
        },
        {
          status: 403,
        },
      );
    }

    /**
     * Active sessions
     */
    const activeSessions = await db.query.sellerSession.findMany({
      where: and(
        eq(sessions.sellerId, existingSeller.id),
        isNull(sessions.revokedAt),
      ),
      orderBy: asc(sessions.createdAt),
    });

    /**
     * Keep only latest 2 sessions.
     */
    if (activeSessions.length >= MAX_ACTIVE_SESSIONS) {
      const sessionsToRevoke = activeSessions.slice(
        0,
        activeSessions.length - MAX_ACTIVE_SESSIONS + 1,
      );

      for (const session of sessionsToRevoke) {
        await db
          .update(sessions)
          .set({
            revokedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(sessions.id, session.id));
      }
    }

    const accessToken = await signAccessToken({
      sub: existingSeller.id,
      email: existingSeller.email,
    });

    const { raw, hash } = generateRefreshToken();

    const forwardedFor = req.headers.get("x-forwarded-for");

    const ipAddress = forwardedFor?.split(",")[0]?.trim() ?? null;

    const [session] = await db
      .insert(sessions)
      .values({
        sellerId: existingSeller.id,

        refreshToken: hash,

        userAgent: req.headers.get("user-agent") ?? null,

        ipAddress,

        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL * 1000),
      })
      .returning({
        id: sessions.id,
      });

    const cookieStore = await cookies();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    };

    cookieStore.set("session_id", session.id, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_TTL,
    });

    cookieStore.set("access_token", accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_TTL,
    });

    cookieStore.set("refresh_token", raw, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_TTL,
    });

    return NextResponse.json({
      success: true,

      user: {
        id: existingSeller.id,
        name: existingSeller.name,
        email: existingSeller.email,
      },
    });
  } catch (error) {
    console.error("LOGIN_ERROR", error);

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
