import { SignJWT, jwtVerify } from "jose";
import { createHash, randomBytes } from "crypto";
import { redis } from "./redis";

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);

export type AccessTokenPayload = {
  sub: string;
  email: string;
  jti: string;
};

export const ACCESS_TOKEN_TTL = 60 * 15;

export const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 7;

export async function signAccessToken(
  payload: Omit<AccessTokenPayload, "jti">,
) {
  const jti = randomBytes(16).toString("hex");

  return new SignJWT({
    ...payload,
    jti,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(ACCESS_SECRET);
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);

    return payload as AccessTokenPayload;
  } catch {
    return null;
  }
}

export function generateRefreshToken() {
  const raw = randomBytes(64).toString("hex");

  const hash = createHash("sha256").update(raw).digest("hex");

  return {
    raw,
    hash,
  };
}

export function hashRefreshToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function isTokenBlocklisted(jti: string): Promise<boolean> {
  return (await redis.exists(`blocklist:${jti}`)) === 1;
}

export async function blocklistToken(jti: string, ttlSeconds: number) {
  await redis.set(`blocklist:${jti}`, 1, {
    ex: ttlSeconds,
  });
}


export async function getAccessTokenPayload(
  token: string
): Promise<AccessTokenPayload & { exp?: number } | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      ACCESS_SECRET
    );

    return payload as AccessTokenPayload & {
      exp?: number;
    };
  } catch {
    return null;
  }
}