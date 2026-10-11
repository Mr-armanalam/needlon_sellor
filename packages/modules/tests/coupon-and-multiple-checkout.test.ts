import assert from "node:assert";

/**
 * Formats order item size and custom properties without duplicate prefixes
 */
export function formatOrderItemProperties(size?: string, properties?: string): string | null {
  if (properties && size) {
    if (properties.toLowerCase().includes(size.toLowerCase())) {
      return properties;
    }
    return `Size: ${size} • ${properties}`;
  }
  if (properties) return properties;
  if (size) return `Size: ${size}`;
  return null;
}

/**
 * Calculates correct financial totals for an order with multiple items
 */
export function calculateOrderFinancials(
  items: Array<{ price: number; quantity?: number }>,
  couponDiscount: number = 0,
  shippingChargePolicy: number = 49
) {
  const itemsSubtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const shipping = itemsSubtotal >= 1999 || itemsSubtotal === 0 ? 0 : shippingChargePolicy;
  const grandTotal = Math.max(0, itemsSubtotal - couponDiscount + shipping);

  return {
    itemCount: items.length,
    itemsSubtotal,
    shippingCharge: shipping,
    couponDiscount,
    grandTotal,
  };
}

/**
 * Simulates coupon evaluation according to the promotions schema and business rules
 */
export function evaluateCouponPromotion(
  promo: {
    couponCode: string;
    status: string;
    discountType: "PERCENTAGE" | "FIXED_AMOUNT";
    discountValue: number;
    minimumOrderAmount?: number | null;
    maximumDiscountAmount?: number | null;
    usageLimit?: number | null;
    totalRedemptions: number;
    startsAt: Date;
    endsAt: Date;
  },
  cartSubtotal: number,
  now: Date = new Date()
) {
  if (promo.status !== "ACTIVE") {
    return { valid: false, message: "Coupon is not active" };
  }

  if (promo.startsAt > now) {
    return { valid: false, message: "Coupon is not active yet" };
  }

  if (promo.endsAt < now) {
    return { valid: false, message: "Coupon has expired" };
  }

  if (promo.usageLimit !== null && promo.totalRedemptions >= (promo.usageLimit ?? Infinity)) {
    return { valid: false, message: "Coupon reached its redemption limit" };
  }

  if (promo.minimumOrderAmount && cartSubtotal < promo.minimumOrderAmount) {
    return {
      valid: false,
      message: `Minimum order amount of ₹${promo.minimumOrderAmount} required`,
    };
  }

  let calculatedDiscount = 0;
  if (promo.discountType === "FIXED_AMOUNT") {
    calculatedDiscount = Math.min(promo.discountValue, cartSubtotal);
  } else {
    calculatedDiscount = Math.round((cartSubtotal * promo.discountValue) / 100);
    if (promo.maximumDiscountAmount && calculatedDiscount > promo.maximumDiscountAmount) {
      calculatedDiscount = promo.maximumDiscountAmount;
    }
  }

  return {
    valid: true,
    discountAmount: calculatedDiscount,
    couponCode: promo.couponCode,
  };
}

async function runCouponAndMultipleCheckoutTests() {
  console.log("--> Running Unit Tests for Coupon Validation & Multiple Checkout...");

  // 1. Property Formatting Tests (Ensure no 'size: s Size: M' duplication)
  const caseDuplicate = formatOrderItemProperties("s", "Size: M");
  assert.strictEqual(
    caseDuplicate,
    "Size: M",
    "Should not duplicate size when properties already contains size"
  );

  const caseOnlySize = formatOrderItemProperties("XL", undefined);
  assert.strictEqual(caseOnlySize, "Size: XL", "Should format lone size correctly");

  const caseOnlyProps = formatOrderItemProperties(undefined, "Bespoke Silk");
  assert.strictEqual(caseOnlyProps, "Bespoke Silk", "Should format lone properties correctly");

  const caseBothDistinct = formatOrderItemProperties("40R", "Slim Fit");
  assert.strictEqual(
    caseBothDistinct,
    "Size: 40R • Slim Fit",
    "Should cleanly combine size and properties when distinct"
  );

  // 2. Multiple Checkout Financial Calculations
  const testCart = [
    { price: 1850, quantity: 1 }, // Casual Floral Western Dress
    { price: 2499, quantity: 1 }, // Classic Oxford Cotton Shirt
  ];

  const financials = calculateOrderFinancials(testCart, 200, 49);
  assert.strictEqual(financials.itemCount, 2, "Item count must be 2");
  assert.strictEqual(financials.itemsSubtotal, 4349, "Items subtotal must accurately sum 1850 + 2499");
  assert.strictEqual(financials.shippingCharge, 0, "Subtotal >= 1999 should grant complimentary shipping");
  assert.strictEqual(financials.grandTotal, 4149, "Grand total must be 4349 - 200 = 4149");

  // Single under-threshold cart item
  const singleSmallCart = [{ price: 899, quantity: 1 }];
  const smallFinancials = calculateOrderFinancials(singleSmallCart, 0, 49);
  assert.strictEqual(smallFinancials.shippingCharge, 49, "Subtotal < 1999 must include single order shipping of 49");
  assert.strictEqual(smallFinancials.grandTotal, 948, "Grand total must be 899 + 49 = 948");

  // 3. Seller Promotion Coupon Validation Tests
  const now = new Date();
  const activePromo = {
    couponCode: "SUMMER20",
    status: "ACTIVE",
    discountType: "PERCENTAGE" as const,
    discountValue: 20,
    minimumOrderAmount: 1000,
    maximumDiscountAmount: 500,
    usageLimit: 100,
    totalRedemptions: 12,
    startsAt: new Date(now.getTime() - 86400000),
    endsAt: new Date(now.getTime() + 86400000 * 10),
  };

  // Valid usage with cap
  const resultValid = evaluateCouponPromotion(activePromo, 3000, now);
  assert.strictEqual(resultValid.valid, true, "Valid promo should pass");
  assert.strictEqual(resultValid.discountAmount, 500, "20% of 3000 is 600, capped at maximum 500");

  // Below minimum order amount
  const resultUnderMin = evaluateCouponPromotion(activePromo, 800, now);
  assert.strictEqual(resultUnderMin.valid, false, "Under min order amount should fail");

  // Expired promo
  const expiredPromo = {
    ...activePromo,
    endsAt: new Date(now.getTime() - 1000),
  };
  const resultExpired = evaluateCouponPromotion(expiredPromo, 2000, now);
  assert.strictEqual(resultExpired.valid, false, "Expired promo should fail");

  // Fixed Amount promo
  const fixedPromo = {
    ...activePromo,
    couponCode: "FLAT300",
    discountType: "FIXED_AMOUNT" as const,
    discountValue: 300,
  };
  const resultFixed = evaluateCouponPromotion(fixedPromo, 1500, now);
  assert.strictEqual(resultFixed.valid, true, "Fixed promo should pass");
  assert.strictEqual(resultFixed.discountAmount, 300, "Fixed discount should be exact value");

  console.log("✓ All Coupon Validation & Multiple Checkout tests passed successfully!");
}

runCouponAndMultipleCheckoutTests().catch((err) => {
  console.error("❌ Test execution failed:", err);
  process.exit(1);
});
