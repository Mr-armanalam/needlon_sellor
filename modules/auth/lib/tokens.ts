// src/lib/tokens.ts
import { SignJWT, jwtVerify } from "jose";
import { createHash, randomBytes } from "crypto";
import { redis } from "./redis";

const ACCESS_SECRET  = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
const REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!);

export type AccessTokenPayload = {
  sub: string;   // userId
  email: string;
  jti: string;   // unique per-token ID — used for blocklisting
};

// Access token: 15 minutes, stored in httpOnly cookie
export async function signAccessToken(payload: Omit<AccessTokenPayload, "jti">) {
  const jti = randomBytes(16).toString("hex");
  return new SignJWT({ ...payload, jti })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(ACCESS_SECRET);
}

// Refresh token: 7 days, raw value stored as httpOnly cookie, SHA-256 hash stored in DB
export function generateRefreshToken() {
  const raw = randomBytes(64).toString("hex");
  const hash = createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload as unknown as AccessTokenPayload;
  } catch {
    return null;
  }
}

// Check if a JTI has been blocklisted (logout/rotation)
export async function isTokenBlocklisted(jti: string): Promise<boolean> {
  return (await redis.exists(`blocklist:${jti}`)) === 1;
}

export async function blocklistToken(jti: string, ttlSeconds: number) {
  await redis.set(`blocklist:${jti}`, 1, { ex: ttlSeconds });
}