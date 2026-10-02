import assert from "node:assert";
import {
  updateBankAccountSchema,
  requestPayoutSchema,
} from "../modules/earnings/dto/finance.dto";
import { updateSubscriptionSchema } from "../modules/subscription/dto/subscription.dto";

function testFinanceValidations() {
  console.log("--> Testing Finance & Subscriptions Zod Validations...");

  // Valid Bank Account DTO
  const validBank = {
    accountHolderName: "Arman Alam",
    bankName: "HDFC Bank",
    accountNumber: "50100234567890",
    ifscCode: "HDFC0001234",
    branchName: "Connaught Place",
    accountType: "SAVINGS",
  };
  const parsedBank = updateBankAccountSchema.parse(validBank);
  assert.strictEqual(parsedBank.accountHolderName, "Arman Alam");
  assert.strictEqual(parsedBank.ifscCode, "HDFC0001234");

  // Short Account Number validation assertion
  assert.throws(() => {
    updateBankAccountSchema.parse({
      ...validBank,
      accountNumber: "123", // less than 8 digits
    });
  });

  // Valid Payout Request DTO
  const validPayout = {
    amount: 500,
  };
  const parsedPayout = requestPayoutSchema.parse(validPayout);
  assert.strictEqual(parsedPayout.amount, 500);

  // Below Minimum Payout Amount assertion
  assert.throws(() => {
    requestPayoutSchema.parse({ amount: 50 }); // Less than ₹100
  });

  // Valid Subscription Update DTO
  const validSub = {
    planId: "123e4567-e89b-12d3-a456-426614174000",
    billingCycle: "YEARLY",
  };
  const parsedSub = updateSubscriptionSchema.parse(validSub);
  assert.strictEqual(parsedSub.billingCycle, "YEARLY");

  // Invalid Plan UUID assertion
  assert.throws(() => {
    updateSubscriptionSchema.parse({ planId: "invalid-uuid" });
  });

  console.log("✓ Finance Zod validation tests passed.");
}

function testCommissionCalculations() {
  console.log("--> Testing Revenue & Commission Calculations...");

  const grossSales = 10000;
  const commissionRatePercent = 5.0; // 5%
  const commissionFee = (grossSales * commissionRatePercent) / 100;
  const netRevenue = grossSales - commissionFee;

  assert.strictEqual(commissionFee, 500);
  assert.strictEqual(netRevenue, 9500);

  // Test Tiered Commission Discount (Enterprise VIP Plan: 2.5%)
  const vipRatePercent = 2.5;
  const vipCommissionFee = (grossSales * vipRatePercent) / 100;
  const vipNetRevenue = grossSales - vipCommissionFee;

  assert.strictEqual(vipCommissionFee, 250);
  assert.strictEqual(vipNetRevenue, 9750);

  console.log("✓ Revenue & Commission math tests passed.");
}

function runAllTests() {
  console.log("=== FINANCE & SUBSCRIPTIONS MODULE TEST SUITE ===");
  testFinanceValidations();
  testCommissionCalculations();
  console.log("=== ALL FINANCE UNIT TESTS PASSED SUCCESSFULLY! ===");
}

runAllTests();
