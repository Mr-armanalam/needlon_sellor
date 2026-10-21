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

import { limitLogin, resetLoginLimit } from "@/modules/auth/lib/rate-limit";
import { successResponse } from "@/modules/shared/api/success-response";

const MAX_ACTIVE_SESSIONS = 2;

function loginError(message: string, status: number, code: string) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message },
    },
    { status },
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = loginRequestSchema.safeParse(body);

    if (!parsed.success) {
      return loginError("Invalid credentials.", 400, "INVALID_CREDENTIALS");
    }

    const { email, password } = parsed.data;

    const ip = getClientIp(req);

    const allowed = await limitLogin(ip, email);

    if (!allowed) {
      return loginError(
        "Too many login attempts. Please try again later.",
        429,
        "TOO_MANY_REQUESTS",
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
      return loginError("Invalid email or password.", 401, "UNAUTHORIZED");
    }

    const passwordValid = await compare(password, existingSeller.passwordHash);

    if (!passwordValid) {
      return loginError("Invalid email or password.", 401, "UNAUTHORIZED");
    }

    await resetLoginLimit(ip, email);

    if (!existingSeller.emailVerified) {
      return loginError(
        "Please verify your email address before logging in.",
        403,
        "EMAIL_NOT_VERIFIED",
      );
    }

    // Platform suspension (admin-managed via seller.is_active).
    if (!existingSeller.isActive) {
      return loginError(
        "This account has been suspended. Please contact support.",
        403,
        "ACCOUNT_SUSPENDED",
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

    // Issue Tokens
    // Role is embedded in the JWT so the middleware can make routing decisions
    // without a DB round-trip. The DB remains authoritative — getCurrentSeller()
    // always re-reads role from Postgres for real data requests.

    const accessToken = await signAccessToken({
      sub: existingSeller.id,
      email: existingSeller.email,
      role: existingSeller.role,
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

    return successResponse({
      user: {
        id: existingSeller.id,
        name: existingSeller.name,
        email: existingSeller.email,
        role: existingSeller.role,
      },
    });
  } catch (error) {
    console.error("LOGIN_ERROR", error);
    return loginError(
      "Unable to sign in right now. Please try again.",
      500,
      "LOGIN_FAILED",
    );
  }
}
