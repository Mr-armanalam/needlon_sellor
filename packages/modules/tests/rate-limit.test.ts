import assert from "node:assert";
import { rateLimit, resetRateLimit } from "../modules/auth/lib/rate-limit";
import { getClientIp } from "../modules/auth/lib/request";
import { NextRequest } from "next/server";

async function testRateLimitBypassWithoutRedis() {
  console.log("--> Testing rateLimit without Redis (bypass mode)...");
  const result = await rateLimit({ key: "test:key", limit: 5, window: 900 });
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.remaining, 5);
  console.log("✓ rateLimit bypass test passed.");
}

async function testResetRateLimitWithoutRedis() {
  console.log("--> Testing resetRateLimit fallback...");
  const res = await resetRateLimit("test:key");
  assert.strictEqual(res, true);
  console.log("✓ resetRateLimit test passed.");
}

function testGetClientIpResolution() {
  console.log("--> Testing getClientIp resolution...");

  // Case 1: Cloudflare IP
  const req1 = new NextRequest("http://localhost/api/login", {
    headers: {
      "cf-connecting-ip": "203.0.113.195",
      "x-real-ip": "198.51.100.1",
      "x-forwarded-for": "192.0.2.1",
    },
  });
  assert.strictEqual(getClientIp(req1), "203.0.113.195");

  // Case 2: Real IP
  const req2 = new NextRequest("http://localhost/api/login", {
    headers: {
      "x-real-ip": "198.51.100.1",
      "x-forwarded-for": "192.0.2.1",
    },
  });
  assert.strictEqual(getClientIp(req2), "198.51.100.1");

  // Case 3: X-Forwarded-For first entry
  const req3 = new NextRequest("http://localhost/api/login", {
    headers: {
      "x-forwarded-for": "192.0.2.1, 10.0.0.1",
    },
  });
  assert.strictEqual(getClientIp(req3), "192.0.2.1");

  // Case 4: Default fallback
  const req4 = new NextRequest("http://localhost/api/login");
  assert.strictEqual(getClientIp(req4), "127.0.0.1");

  console.log("✓ getClientIp tests passed.");
}

async function runAllRateLimitTests() {
  console.log("=== RATE LIMIT MODULE TEST SUITE ===");
  await testRateLimitBypassWithoutRedis();
  await testResetRateLimitWithoutRedis();
  testGetClientIpResolution();
  console.log("=== ALL RATE LIMIT TESTS PASSED SUCCESSFULLY! ===");
}

runAllRateLimitTests().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
