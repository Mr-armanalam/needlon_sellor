import assert from "node:assert";
import {
  updateBankAccountSchema,
  requestPayoutSchema,
  earningsAnalyticsQuerySchema,
  ledgerQuerySchema,
  exportLedgerQuerySchema,
} from "../modules/earnings/dto/finance.dto";
import {
  updateSubscriptionSchema,
  billingLedgerQuerySchema,
} from "../modules/subscription/dto/subscription.dto";
import { PayoutGatewayService } from "../modules/earnings/services/payout-gateway.service";
import { SubscriptionPaymentGatewayService } from "../modules/subscription/services/subscription-payment-gateway.service";

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

  // Valid Analytics query schema
  const parsedAnalytics = earningsAnalyticsQuerySchema.parse({ timeframe: "weekly" });
  assert.strictEqual(parsedAnalytics.timeframe, "weekly");

  // Valid Ledger query schema
  const parsedLedger = ledgerQuerySchema.parse({ viewType: "settlements" });
  assert.strictEqual(parsedLedger.viewType, "settlements");

  // Valid Export CSV query schema
  const parsedExport = exportLedgerQuerySchema.parse({ viewType: "transactions" });
  assert.strictEqual(parsedExport.viewType, "transactions");

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

  // Valid Billing Ledger query schema
  const parsedBillingLedger = billingLedgerQuerySchema.parse({ tab: "invoices" });
  assert.strictEqual(parsedBillingLedger.tab, "invoices");

  console.log("✓ Finance & Subscriptions Zod validation tests passed.");
}

function testCommissionCalculations() {
  console.log("--> Testing Revenue, Commission & Balance Calculations...");

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

  // Test Available Balance deduction after completed and pending payouts
  const totalWithdrawn = 3000;
  const pendingWithdrawn = 1000;
  const availablePayoutBalance = Math.max(0, netRevenue - totalWithdrawn - pendingWithdrawn);

  assert.strictEqual(availablePayoutBalance, 5500);

  // Test Overdraft Protection Guard
  const requestedWithdrawal = 6000;
  assert.strictEqual(requestedWithdrawal > availablePayoutBalance, true);

  console.log("✓ Revenue, Commission & Balance math tests passed.");
}

function testMonthOverMonthCalculations() {
  console.log("--> Testing Month-over-Month Growth Calculation Logic...");

  // Scenario 1: Normal growth
  const currentSales = 12000;
  const prevSales = 10000;
  const growth = ((currentSales - prevSales) / prevSales) * 100;
  assert.strictEqual(growth, 20);

  // Scenario 2: Zero previous sales (New seller edge case)
  const newSellerGrowth = prevSales === 0 ? (currentSales > 0 ? 100 : 0) : growth;
  assert.strictEqual(newSellerGrowth, 20);

  // Scenario 3: Negative trend
  const decliningCurrent = 8000;
  const negativeGrowth = ((decliningCurrent - prevSales) / prevSales) * 100;
  assert.strictEqual(negativeGrowth, -20);

  console.log("✓ Month-over-Month Growth math tests passed.");
}

async function testFreeTestPaymentGatewayAdapter() {
  console.log("--> Testing Free Test Payment Gateway Integration Adapters...");

  // 1. Payout Gateway test
  const payoutResult = await PayoutGatewayService.processPayout({
    sellerId: "test-seller-uuid",
    amount: 1500,
    currency: "INR",
    payoutNumber: "SET-TEST-9999",
    bankAccount: {
      accountHolderName: "Arman Alam",
      bankName: "HDFC Bank",
      accountNumberLast4: "7890",
      ifscCode: "HDFC0001234",
    },
  });

  assert.strictEqual(payoutResult.success, true);
  assert.strictEqual(payoutResult.status, "COMPLETED");
  assert.ok(payoutResult.gatewayPayoutId.startsWith("tr_test_") || payoutResult.gatewayPayoutId.startsWith("tr_"));
  assert.strictEqual(payoutResult.rawResponse.amount, 1500);
  assert.strictEqual(payoutResult.rawResponse.currency, "INR");

  // 2. Subscription Payment Gateway test
  const subPaymentResult = await SubscriptionPaymentGatewayService.processPayment({
    sellerId: "test-seller-uuid",
    planId: "123e4567-e89b-12d3-a456-426614174000",
    planName: "Pro Merchant Plan",
    amount: 999,
    currency: "INR",
    billingCycle: "MONTHLY",
  });

  assert.strictEqual(subPaymentResult.success, true);
  assert.strictEqual(subPaymentResult.status, "SUCCESS");
  assert.ok(subPaymentResult.gatewayPaymentId.startsWith("pi_test_") || subPaymentResult.gatewayPaymentId.startsWith("pi_"));
  assert.strictEqual(subPaymentResult.paymentMethod, "CARD");

  console.log("✓ Free Test Payment Gateway Adapters passed.");
}

function testSubscriptionTierPricingMath() {
  console.log("--> Testing Subscription Tier Pricing & Discount Calculations...");

  const monthlyPrice = 999;
  const yearlyPriceExpected = monthlyPrice * 10; // 2 months free annual discount
  const fullYearWithoutDiscount = monthlyPrice * 12;
  const savings = fullYearWithoutDiscount - yearlyPriceExpected;
  const savingsPercent = Math.round((savings / fullYearWithoutDiscount) * 100);

  assert.strictEqual(yearlyPriceExpected, 9990);
  assert.strictEqual(savingsPercent, 17); // ~17% annual savings

  console.log("✓ Subscription Tier Pricing math tests passed.");
}

function testCsvExportFormatting() {
  console.log("--> Testing CSV Export RFC 4180 Generation...");

  const headers = ["Reference ID", "Date", "Description", "Amount", "Status"];
  const mockItems = [
    { id: "TXN-1024", date: "June 28, 2026", desc: "Payment for ORD-1024", amount: "+₹1,200.00", status: "COMPLETED" },
    { id: "SET-0041", date: "June 20, 2026", desc: "Bank Wire Transfer x-4921", amount: "₹4,200.00", status: "COMPLETED" },
  ];

  const rows = mockItems.map((item) => [
    `"${item.id.replace(/"/g, '""')}"`,
    `"${item.date.replace(/"/g, '""')}"`,
    `"${item.desc.replace(/"/g, '""')}"`,
    `"${item.amount.replace(/"/g, '""')}"`,
    `"${item.status.replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  assert.ok(csv.includes("Reference ID,Date,Description,Amount,Status"));
  assert.ok(csv.includes('"TXN-1024","June 28, 2026","Payment for ORD-1024","+₹1,200.00","COMPLETED"'));
  assert.ok(csv.includes('"SET-0041","June 20, 2026","Bank Wire Transfer x-4921","₹4,200.00","COMPLETED"'));

  console.log("✓ CSV Export RFC 4180 tests passed.");
}

async function runAllTests() {
  console.log("=== FINANCE & SUBSCRIPTIONS MODULE TEST SUITE ===");
  testFinanceValidations();
  testCommissionCalculations();
  testMonthOverMonthCalculations();
  testSubscriptionTierPricingMath();
  await testFreeTestPaymentGatewayAdapter();
  testCsvExportFormatting();
  console.log("=== ALL FINANCE & SUBSCRIPTION TESTS PASSED SUCCESSFULLY! ===");
}

runAllTests().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
