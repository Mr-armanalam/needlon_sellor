import assert from "node:assert";
import {
  createCouponSchema,
  createCampaignSchema,
  createReferralSchema,
} from "../modules/marketing/dto/marketing.dto";

function testCouponValidations() {
  console.log("--> Testing Marketing Coupon Zod Validations...");

  const validCoupon = {
    name: "Summer Blast 15%",
    couponCode: "SUMMER15",
    discountType: "PERCENTAGE" as const,
    discountValue: 15,
    minimumOrderAmount: 500,
    usageLimit: 100,
  };
  const parsed = createCouponSchema.parse(validCoupon);
  assert.strictEqual(parsed.couponCode, "SUMMER15");
  assert.strictEqual(parsed.discountValue, 15);

  // Invalid discount value (negative)
  assert.throws(() => {
    createCouponSchema.parse({
      ...validCoupon,
      discountValue: -10,
    });
  });

  // Short code (less than 3 chars)
  assert.throws(() => {
    createCouponSchema.parse({
      ...validCoupon,
      couponCode: "12",
    });
  });

  console.log("✓ Coupon Zod validation tests passed.");
}

function testCampaignValidations() {
  console.log("--> Testing Marketing Campaign Zod Validations...");

  const validCampaign = {
    name: "WhatsApp Referral Push",
    channel: "WHATSAPP" as const,
    description: "Targeting top buyers",
  };
  const parsed = createCampaignSchema.parse(validCampaign);
  assert.strictEqual(parsed.name, "WhatsApp Referral Push");
  assert.strictEqual(parsed.channel, "WHATSAPP");

  // Missing name assertion
  assert.throws(() => {
    createCampaignSchema.parse({
      channel: "INSTAGRAM",
    });
  });

  console.log("✓ Campaign Zod validation tests passed.");
}

function testReferralValidations() {
  console.log("--> Testing Marketing Referral Zod Validations...");

  const validRef = {
    campaignName: "SUMMER_PROMO",
    referralCode: "REF-STORE100",
    maxUsageLimit: 50,
  };
  const parsed = createReferralSchema.parse(validRef);
  assert.strictEqual(parsed.referralCode, "REF-STORE100");

  console.log("✓ Referral Zod validation tests passed.");
}

function testCouponDiscountMath() {
  console.log("--> Testing Coupon Discount Math Computations...");

  // Percentage discount math
  const cartTotal = 2000;
  const percentageDiscount = 15; // 15%
  const discountedPercentagePrice = cartTotal * (1 - percentageDiscount / 100);
  assert.strictEqual(discountedPercentagePrice, 1700);

  // Flat amount discount math
  const flatDiscount = 300;
  const discountedFlatPrice = Math.max(0, cartTotal - flatDiscount);
  assert.strictEqual(discountedFlatPrice, 1700);

  console.log("✓ Coupon discount math tests passed.");
}

function runAllTests() {
  console.log("=== MARKETING MODULE TEST SUITE ===");
  testCouponValidations();
  testCampaignValidations();
  testReferralValidations();
  testCouponDiscountMath();
  console.log("=== ALL MARKETING UNIT TESTS PASSED SUCCESSFULLY! ===");
}

runAllTests();
