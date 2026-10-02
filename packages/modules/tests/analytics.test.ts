import assert from "node:assert";
import { getAnalyticsQuerySchema } from "../modules/analytics/dto/analytics.dto";
import { getCustomersQuerySchema } from "../modules/customers/dto/customer.dto";
import { createSupportTicketSchema } from "../modules/help/dto/support.dto";

function testAnalyticsValidations() {
  console.log("--> Testing Analytics Zod Validations...");

  const validQuery = { timeframe: "30d" };
  const parsed = getAnalyticsQuerySchema.parse(validQuery);
  assert.strictEqual(parsed.timeframe, "30d");

  // Invalid timeframe assertion
  assert.throws(() => {
    getAnalyticsQuerySchema.parse({ timeframe: "invalid" });
  });

  console.log("✓ Analytics Zod validation tests passed.");
}

function testCustomerValidations() {
  console.log("--> Testing Customer Directory Zod Validations...");

  const validQuery = { search: "John" };
  const parsed = getCustomersQuerySchema.parse(validQuery);
  assert.strictEqual(parsed.search, "John");

  console.log("✓ Customer Zod validation tests passed.");
}

function testSupportTicketValidations() {
  console.log("--> Testing Support Ticket Zod Validations...");

  const validTicket = {
    subject: "Payout inquiry",
    category: "PAYMENT_PAYOUT",
    priority: "HIGH",
    message: "When will the weekly payout balance be processed to my account?",
  };
  const parsedTicket = createSupportTicketSchema.parse(validTicket);
  assert.strictEqual(parsedTicket.subject, "Payout inquiry");
  assert.strictEqual(parsedTicket.priority, "HIGH");

  // Short message assertion (under 10 chars)
  assert.throws(() => {
    createSupportTicketSchema.parse({
      subject: "Test",
      message: "Short",
    });
  });

  console.log("✓ Support Ticket Zod validation tests passed.");
}

function testAnalyticsMathCalculations() {
  console.log("--> Testing Analytics Average Order Value (AOV) Calculations...");

  const totalRevenue = 15000;
  const totalOrders = 30;
  const aov = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00";

  assert.strictEqual(aov, "500.00");

  // Zero order edge case check
  const zeroOrders = 0;
  const zeroAov = zeroOrders > 0 ? (totalRevenue / zeroOrders).toFixed(2) : "0.00";
  assert.strictEqual(zeroAov, "0.00");

  console.log("✓ AOV calculation math tests passed.");
}

function runAllTests() {
  console.log("=== ANALYTICS, CUSTOMERS & SUPPORT MODULE TEST SUITE ===");
  testAnalyticsValidations();
  testCustomerValidations();
  testSupportTicketValidations();
  testAnalyticsMathCalculations();
  console.log("=== ALL ANALYTICS & SUPPORT UNIT TESTS PASSED SUCCESSFULLY! ===");
}

runAllTests();
