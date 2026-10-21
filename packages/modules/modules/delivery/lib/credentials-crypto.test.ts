import assert from "node:assert";
import {
  encryptCredentials,
  decryptCredentials,
} from "./credentials-crypto";

// Run with: tsx modules/delivery/lib/credentials-crypto.test.ts
// (from packages/modules). No database required.

const TEST_KEY =
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

function runTests() {
  console.log("Running credentials-crypto tests...");

  // Missing key must fail loudly, never fall back to plaintext storage.
  delete process.env.CARRIER_CREDENTIALS_KEY;
  assert.throws(
    () => encryptCredentials({ apiKey: "x" }),
    /CARRIER_CREDENTIALS_KEY is not configured/,
    "encrypt without a configured key must throw",
  );
  console.log("✓ missing key fails loudly");

  process.env.CARRIER_CREDENTIALS_KEY = TEST_KEY;

  const original = {
    apiKey: "sr_live_key_123",
    apiSecret: "sr_live_secret_456",
  };
  const ciphertext = encryptCredentials(original);

  assert.notStrictEqual(
    ciphertext.includes(original.apiKey),
    true,
    "ciphertext must not contain the plaintext apiKey",
  );
  assert.strictEqual(
    ciphertext.startsWith("v1."),
    true,
    "ciphertext carries the v1 format marker",
  );
  console.log("✓ encrypt produces opaque v1 ciphertext");

  const roundTripped = decryptCredentials(ciphertext);
  assert.deepStrictEqual(
    roundTripped,
    original,
    "decrypt(encrypt(x)) must equal x",
  );
  console.log("✓ round-trip restores the credentials");

  // Tampering with the payload must fail GCM authentication.
  const parts = ciphertext.split(".");
  const tampered = [...parts.slice(0, 3), Buffer.from("tampered").toString("base64")].join(".");
  assert.throws(
    () => decryptCredentials(tampered),
    Error,
    "tampered ciphertext must throw",
  );
  console.log("✓ tampered ciphertext is rejected");

  // A different key must not decrypt.
  process.env.CARRIER_CREDENTIALS_KEY =
    "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210";
  assert.throws(
    () => decryptCredentials(ciphertext),
    Error,
    "decrypting with the wrong key must throw",
  );
  console.log("✓ wrong key is rejected");

  console.log("=== ALL CREDENTIALS-CRYPTO TESTS PASSED ===");
  process.exit(0);
}

runTests();
