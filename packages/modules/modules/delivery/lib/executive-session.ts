import { createHmac } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

/**
 * Delivery-executive session tokens.
 *
 * Executives are not sellers: they authenticate with phone + password and
 * receive their own cookie (`executive-session`), completely separate from
 * the seller access/refresh token pair in modules/auth/lib/tokens.ts.
 *
 * The signing key is an HMAC derivation of AUTH_SECRET with a fixed
 * purpose string, so an executive token can never be replayed as a seller
 * access token (or vice versa) even though both ultimately anchor to the
 * same deployment secret. Verification additionally requires the `kind`
 * claim, so a token minted for any other purpose is rejected.
 *
 * The secret is read lazily on every call (never at module load) so tests
 * and key rotation don't depend on import order.
 */
export const EXECUTIVE_SESSION_COOKIE = "executive-session";

const TOKEN_KIND = "delivery-executive";
const KEY_PURPOSE = "needlon:delivery-executive-session:v1";
export const EXECUTIVE_SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function getExecutiveSessionKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not configured; cannot issue or verify executive session tokens",
    );
  }
  return createHmac("sha256", secret).update(KEY_PURPOSE).digest();
}

export interface ExecutiveSessionPayload {
  executiveId: string;
}

export async function createExecutiveSessionToken(
  executiveId: string,
): Promise<string> {
  return new SignJWT({ kind: TOKEN_KIND, executiveId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(executiveId)
    .setIssuedAt()
    .setExpirationTime(`${EXECUTIVE_SESSION_TTL_SECONDS}s`)
    .sign(getExecutiveSessionKey());
}

/**
 * Verify an executive session token. Returns the payload for a valid,
 * unexpired token minted by createExecutiveSessionToken; null for anything
 * else (bad signature, wrong secret, expired, wrong kind, malformed).
 */
export async function verifyExecutiveSessionToken(
  token: string | undefined | null,
): Promise<ExecutiveSessionPayload | null> {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, getExecutiveSessionKey());
    if (payload.kind !== TOKEN_KIND) {
      return null;
    }
    const executiveId = payload.executiveId;
    if (typeof executiveId !== "string" || executiveId.length === 0) {
      return null;
    }
    if (payload.sub !== executiveId) {
      return null;
    }
    return { executiveId };
  } catch {
    return null;
  }
}
