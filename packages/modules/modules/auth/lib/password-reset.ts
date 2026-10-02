import { redis } from "./redis";
import { randomBytes } from "crypto";

const RESET_TOKEN_TTL = 60 * 10; // 10 minutes

export async function createPasswordResetToken(sellerId: string) {
  const token = randomBytes(32).toString("hex");

  await redis.set(`password-reset:${token}`, sellerId, { ex: RESET_TOKEN_TTL });

  return token;
}

export async function consumePasswordResetToken(
  token: string,
): Promise<string | null> {
  const key = `password-reset:${token}`;

  const sellerId = await redis.get<string>(key);

  if (!sellerId) return null;

  await redis.del(key);

  return sellerId;
}

export async function getPasswordResetToken(
  token: string,
): Promise<string | null> {
  return redis.get<string>(`password-reset:${token}`);
}
