// src/lib/otp.ts
import { createHmac, randomInt } from "crypto";
import { redis } from "./redis";

const OTP_SECRET = process.env.OTP_HMAC_SECRET!;
const OTP_TTL    = 60 * 10;   // 10 minutes
const OTP_MAX_ATTEMPTS = 5;
const RATE_LIMIT_TTL   = 60 * 60; // 1 hour

// Generate a 6-digit OTP and HMAC-sign it so it can't be brute-forced without the secret
function generateOtp(email: string, code: string): string {
  return createHmac("sha256", OTP_SECRET).update(`${email}:${code}`).digest("hex").slice(0, 8);
}

export async function createOtp(email: string): Promise<{ code: string } | { error: string }> {
  const rateLimitKey = `otp:ratelimit:${email}`;
  const count = await redis.incr(rateLimitKey);
  if (count === 1) await redis.expire(rateLimitKey, RATE_LIMIT_TTL);
  if (count > 3) return { error: "Too many OTP requests. Try again in 1 hour." };

  const code = String(randomInt(100000, 999999)); // 6 digits
  const sig  = generateOtp(email, code);
  const key  = `otp:${email}`;

  await redis.set(key, JSON.stringify({ code, sig, attempts: 0 }), { ex: OTP_TTL });
  return { code };
}

export async function verifyOtp(
  email: string,
  submitted: string
): Promise<{ valid: true } | { valid: false; error: string }> {
  const key  = `otp:${email}`;
  const raw  = await redis.get<string>(key);
  if (!raw) return { valid: false, error: "OTP expired or not found." };

  const data = typeof raw === "string" ? JSON.parse(raw) : raw as { code: string; sig: string; attempts: number };

  if (data.attempts >= OTP_MAX_ATTEMPTS) {
    await redis.del(key);
    return { valid: false, error: "Too many failed attempts." };
  }

  const expectedSig = generateOtp(email, submitted);
  const isMatch     = expectedSig === data.sig && data.code === submitted;

  if (!isMatch) {
    await redis.set(key, JSON.stringify({ ...data, attempts: data.attempts + 1 }), { ex: OTP_TTL });
    return { valid: false, error: "Invalid OTP." };
  }

  await redis.del(key); // single-use
  return { valid: true };
}