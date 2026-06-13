import { createHmac, randomInt } from "crypto";
import { redis } from "./redis";

const OTP_SECRET = process.env.OTP_HMAC_SECRET!;

const OTP_TTL = 60 * 10;
const OTP_MAX_ATTEMPTS = 5;
const RATE_LIMIT_TTL = 60 * 60;

export type OtpType = "signup" | "reset";

type OtpRecord = {
  code: string;
  sig: string;
  attempts: number;
};

function signOtp(email: string, code: string, type: OtpType) {
  return createHmac("sha256", OTP_SECRET)
    .update(`${type}:${email}:${code}`)
    .digest("hex");
}

function otpKey(email: string, type: OtpType) {
  return `otp:${type}:${email}`;
}

function rateLimitKey(email: string, type: OtpType) {
  return `otp:ratelimit:${type}:${email}`;
}

export async function createOtp(
  email: string,
  type: OtpType,
): Promise<{ code: string } | { error: string }> {
  const limitKey = rateLimitKey(email, type);

  const count = await redis.incr(limitKey);

  if (count === 1) {
    await redis.expire(limitKey, RATE_LIMIT_TTL);
  }

  if (count > 3) {
    return {
      error: "Too many OTP requests. Please try again later.",
    };
  }

  const code = String(randomInt(100000, 999999));

  const record: OtpRecord = {
    code,
    sig: signOtp(email, code, type),
    attempts: 0,
  };

  await redis.set(otpKey(email, type), JSON.stringify(record), {
    ex: OTP_TTL,
  });

  return { code };
}

export async function verifyOtp(
  email: string,
  submitted: string,
  type: OtpType,
): Promise<{ valid: true } | { valid: false; error: string }> {
  const key = otpKey(email, type);

  const raw = await redis.get<string>(key);

  if (!raw) {
    return {
      valid: false,
      error: "OTP expired or invalid.",
    };
  }

  const data: OtpRecord = typeof raw === "string" ? JSON.parse(raw) : raw;

  if (data.attempts >= OTP_MAX_ATTEMPTS) {
    await redis.del(key);

    return {
      valid: false,
      error: "Too many failed attempts.",
    };
  }

  const expectedSig = signOtp(email, submitted, type);

  const valid = expectedSig === data.sig && submitted === data.code;

  if (!valid) {
    await redis.set(
      key,
      JSON.stringify({
        ...data,
        attempts: data.attempts + 1,
      }),
      {
        ex: OTP_TTL,
      },
    );

    return {
      valid: false,
      error: "Invalid OTP.",
    };
  }

  await redis.del(key);

  return {
    valid: true,
  };
}
