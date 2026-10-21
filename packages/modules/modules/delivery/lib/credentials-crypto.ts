import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "crypto";

/**
 * Encryption for seller carrier credentials (API keys/secrets, aggregator
 * logins) stored in seller_carrier_connections.credentials_encrypted.
 *
 * AES-256-GCM. The key comes from the CARRIER_CREDENTIALS_KEY environment
 * variable (64 hex characters = 32 bytes) and is read lazily on every call
 * so configuration errors surface loudly at connect time — credentials are
 * never stored or compared in plaintext, and there is no fallback key.
 *
 * Ciphertext format: v1.<iv base64>.<authTag base64>.<data base64>
 */

const CIPHER_VERSION = "v1";
const IV_LENGTH_BYTES = 12;

function loadKey(): Buffer {
  const raw = process.env.CARRIER_CREDENTIALS_KEY;
  if (!raw || !/^[0-9a-fA-F]{64}$/.test(raw)) {
    throw new Error(
      "CARRIER_CREDENTIALS_KEY is not configured: set it to 64 hex characters (32 bytes) to store carrier credentials.",
    );
  }
  return Buffer.from(raw, "hex");
}

export type CarrierCredentials = Record<string, string>;

export function encryptCredentials(
  credentials: CarrierCredentials,
): string {
  const key = loadKey();
  const iv = randomBytes(IV_LENGTH_BYTES);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(credentials), "utf8");
  const data = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    CIPHER_VERSION,
    iv.toString("base64"),
    tag.toString("base64"),
    data.toString("base64"),
  ].join(".");
}

function isCredentialsRecord(value: unknown): value is CarrierCredentials {
  if (typeof value !== "object" || value === null) return false;
  return Object.values(value).every((v) => typeof v === "string");
}

export function decryptCredentials(ciphertext: string): CarrierCredentials {
  const key = loadKey();
  const parts = ciphertext.split(".");
  if (parts.length !== 4 || parts[0] !== CIPHER_VERSION) {
    throw new Error("Stored carrier credentials have an unsupported format.");
  }
  const [, ivB64, tagB64, dataB64] = parts;
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(ivB64, "base64"),
  );
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64")),
    decipher.final(),
  ]);
  const parsed: unknown = JSON.parse(plaintext.toString("utf8"));
  if (!isCredentialsRecord(parsed)) {
    throw new Error("Stored carrier credentials are corrupted.");
  }
  return parsed;
}
