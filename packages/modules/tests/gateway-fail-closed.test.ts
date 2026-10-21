import assert from "node:assert";

/**
 * Fail-closed contract tests for the money gateways.
 *
 * The payout and subscription gateways previously contained a "Sandbox
 * Simulator" that fabricated successful results (COMPLETED payouts with
 * tr_test_ ids, SUCCESS payments with pi_test_ ids) whenever Stripe was
 * unconfigured or the Stripe call failed — and a live sk_live_ key fell
 * into the simulator because only sk_test_ keys took the real path.
 *
 * These tests pin the honest contract:
 *  1. No Stripe key configured  -> FAILED, never COMPLETED/SUCCESS.
 *  2. Invalid Stripe key        -> FAILED with the real error, never faked.
 *
 * Both gateway services read STRIPE_SECRET_KEY at call time from
 * process.env, so the env is set before each scenario and the modules are
 * loaded via dynamic import after the env is in place. The gateways are
 * DB-independent, so no database is required.
 */

const PAYOUT_REQUEST = {
  sellerId: "test-seller-uuid",
  amount: 1500,
  currency: "INR",
  payoutNumber: "SET-FAILCLOSED-1",
  bankAccount: {
    accountHolderName: "Test Seller",
    bankName: "HDFC Bank",
    accountNumberLast4: "7890",
    ifscCode: "HDFC0001234",
  },
};

const SUBSCRIPTION_REQUEST = {
  sellerId: "test-seller-uuid",
  planId: "123e4567-e89b-12d3-a456-426614174000",
  planName: "Pro Merchant Plan",
  amount: 999,
  currency: "INR",
  billingCycle: "MONTHLY" as const,
};

async function testNoKeyConfigured() {
  console.log("--> Gateways fail closed when Stripe is not configured...");
  delete process.env.STRIPE_SECRET_KEY;

  const { PayoutGatewayService } = await import(
    "../modules/earnings/services/payout-gateway.service"
  );
  const { SubscriptionPaymentGatewayService } = await import(
    "../modules/subscription/services/subscription-payment-gateway.service"
  );

  const payout = await PayoutGatewayService.processPayout(PAYOUT_REQUEST);
  assert.strictEqual(payout.success, false, "payout must not succeed without a gateway");
  assert.strictEqual(payout.status, "FAILED", "payout must be FAILED without a gateway");
  assert.notStrictEqual(payout.status, "COMPLETED");
  assert.strictEqual(payout.gatewayPayoutId, "", "no gateway id may be fabricated");
  assert.ok(
    !payout.gatewayPayoutId.startsWith("tr_test_"),
    "gateway id must not be a simulated tr_test_ id"
  );
  assert.ok(payout.failureReason?.includes("not configured"));

  const payment = await SubscriptionPaymentGatewayService.processPayment(
    SUBSCRIPTION_REQUEST
  );
  assert.strictEqual(payment.success, false, "payment must not succeed without a gateway");
  assert.strictEqual(payment.status, "FAILED", "payment must be FAILED without a gateway");
  assert.notStrictEqual(payment.status, "SUCCESS");
  assert.strictEqual(payment.gatewayPaymentId, "", "no gateway id may be fabricated");
  assert.ok(
    !payment.gatewayPaymentId.startsWith("pi_test_"),
    "gateway id must not be a simulated pi_test_ id"
  );
  assert.ok(payment.failureReason?.includes("not configured"));

  console.log("✓ No-key scenario: both gateways FAILED, nothing fabricated.");
}

async function testInvalidKeyFails() {
  console.log("--> Gateways record FAILED (not success) when Stripe rejects the call...");
  // A well-formed but invalid secret key: Stripe answers 401, and any
  // network failure throws — both paths must end FAILED, never COMPLETED.
  process.env.STRIPE_SECRET_KEY = "sk_test_invalid_fail_closed_test_key";

  const { PayoutGatewayService } = await import(
    "../modules/earnings/services/payout-gateway.service"
  );
  const { SubscriptionPaymentGatewayService } = await import(
    "../modules/subscription/services/subscription-payment-gateway.service"
  );

  const payout = await PayoutGatewayService.processPayout(PAYOUT_REQUEST);
  assert.strictEqual(payout.success, false, "payout must not succeed with an invalid key");
  assert.strictEqual(payout.status, "FAILED");
  assert.notStrictEqual(payout.status, "COMPLETED");
  assert.strictEqual(payout.gatewayPayoutId, "");
  assert.ok(payout.failureReason && payout.failureReason.length > 0, "real failure reason recorded");

  const payment = await SubscriptionPaymentGatewayService.processPayment(
    SUBSCRIPTION_REQUEST
  );
  assert.strictEqual(payment.success, false, "payment must not succeed with an invalid key");
  assert.strictEqual(payment.status, "FAILED");
  assert.notStrictEqual(payment.status, "SUCCESS");
  assert.strictEqual(payment.gatewayPaymentId, "");
  assert.ok(payment.failureReason && payment.failureReason.length > 0, "real failure reason recorded");

  console.log("✓ Invalid-key scenario: both gateways FAILED with a real reason.");
}

async function runAllTests() {
  console.log("=== GATEWAY FAIL-CLOSED TEST SUITE ===");
  const savedKey = process.env.STRIPE_SECRET_KEY;
  try {
    await testNoKeyConfigured();
    await testInvalidKeyFails();
  } finally {
    if (savedKey === undefined) {
      delete process.env.STRIPE_SECRET_KEY;
    } else {
      process.env.STRIPE_SECRET_KEY = savedKey;
    }
  }
  console.log("=== ALL GATEWAY FAIL-CLOSED TESTS PASSED SUCCESSFULLY! ===");
}

runAllTests().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
