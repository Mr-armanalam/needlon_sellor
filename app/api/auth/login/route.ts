
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { loginSchema } from "@/modules/auth/validations/login";
import { db } from "@/db";
import { seller, sessions } from "@/db/schema/seller";
import {
  generateRefreshToken,
  signAccessToken,
} from "@/modules/auth/lib/tokens";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid request",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const seller_data = await db.query.sellers.findFirst({
      where: eq(seller.email, email),
    });

    if (!seller_data) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    if (!seller_data.passwordHash) {
      return NextResponse.json(
        {
          message: "Password login not available for this account",
        },
        { status: 401 },
      );
    }

    const passwordValid = bcrypt.compare(password, seller_data.passwordHash);

    if (!passwordValid) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    if (!seller.emailVerified) {
      return NextResponse.json(
        {
          message: "Please verify your email first",
        },
        { status: 403 },
      );
    }

    const accessToken = await signAccessToken({
      sub: seller_data.id,
      email: seller_data.email,
    });

    const refreshToken = generateRefreshToken();

    const userAgent = req.headers.get("user-agent") ?? null;

    const forwardedFor = req.headers.get("x-forwarded-for");

    const ipAddress =
      forwardedFor?.split(",")[0] ?? req.headers.get("x-real-ip") ?? null;

    await db.insert(sessions).values({
      sellerId: seller_data.id,
      refreshToken: refreshToken.hash,
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: seller_data.id,
        email: seller_data.email,
      },
    });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60,
    });

    response.cookies.set("refresh_token", refreshToken.raw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("LOGIN_ERROR", error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
