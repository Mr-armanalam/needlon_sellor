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
  const count =
    await redis.incr(key);

  if (count === 1) {
    await redis.expire(
      key,
      window
    );
  }

  return {
    success: count <= limit,
    remaining: Math.max(
      0,
      limit - count
    ),
  };
}


const FIFTEEN_MINUTES =
  60 * 15;

const ONE_HOUR =
  60 * 60;

export async function limitLogin(
  ip: string,
  email: string
) {
  const ipResult =
    await rateLimit({
      key: `rl:login:ip:${ip}`,
      limit: 20, // TODO: Wrong
      // limit: 10, // Correct
      window:
        FIFTEEN_MINUTES,
    });

  const emailResult =
    await rateLimit({
      key: `rl:login:email:${email}`,
      limit: 5,
      window:
        FIFTEEN_MINUTES,
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