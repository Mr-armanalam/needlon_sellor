import { redis } from "./redis";

type LimitOptions = {
  key: string;
  limit: number;
  window: number;
};

type LimitResult = {
  success: boolean;
  remaining: number;
};

export async function rateLimit({
  key,
  limit,
  window,
}: LimitOptions): Promise<LimitResult> {
  if (!redis) {
    return {
      success: true,
      remaining: limit,
    };
  }

  try {
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, window);
    } else {
      // Defensive check: if TTL is missing (-1 or -2), re-apply expiry window to prevent keys locking permanently
      const ttl = await redis.ttl(key);
      if (ttl < 0) {
        await redis.expire(key, window);
      }
    }

    return {
      success: count <= limit,
      remaining: Math.max(0, limit - count),
    };
  } catch (error) {
    console.warn("[RateLimit] Redis error, bypassing rate limit:", error);
    return {
      success: true,
      remaining: limit,
    };
  }
}

export async function resetRateLimit(key: string): Promise<boolean> {
  if (!redis) return true;
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.warn("[RateLimit] Failed to reset rate limit key:", error);
    return false;
  }
}


const FIFTEEN_MINUTES = 60 * 15;

const ONE_HOUR = 60 * 60;

export async function limitLogin(
  ip: string,
  email: string
) {
  const normalizedEmail = email.trim().toLowerCase();

  const ipResult =
    await rateLimit({
      key: `rl:login:ip:${ip}`,
      limit: 10,
      window: FIFTEEN_MINUTES,
    });

  const emailResult =
    await rateLimit({
      key: `rl:login:email:${normalizedEmail}`,
      limit: 5,
      window: FIFTEEN_MINUTES,
    });

  return (
    ipResult.success &&
    emailResult.success
  );
}

export async function limitForgotPassword(
  email: string
) {
  const result =
    await rateLimit({
      key: `rl:forgot:${email}`,
      limit: 5,
      window: ONE_HOUR,
    });

  return result.success;
}

export async function limitVerifyOtp(
  email: string
) {
  const result =
    await rateLimit({
      key:
        `rl:verify-otp:${email}`,
      limit: 10,
      window: ONE_HOUR,
    });

  return result.success;
}