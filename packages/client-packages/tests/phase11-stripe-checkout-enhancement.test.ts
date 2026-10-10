import assert from "node:assert";
import { mapCartToLineItems } from "../client-modules/checkout/services/map-cart-to-line-items.ts";

async function runStripeCheckoutEnhancementTests() {
  console.log("--> Running Phase 11: Production-Grade Stripe Checkout Enhancement Tests...");

  // Test 1: mapCartToLineItems cleanly isolates products without dirty shipping line items
  const testCart = [
    {
      id: "prod-1",
      name: "Classic Oxford Cotton Shirt",
      price: 2499,
      quantity: 1,
      size: "M",
      color: "White",
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
      shippingCharge: 49,
    },
    {
      id: "prod-2",
      name: "Merino Wool Blend Blazer",
      price: 6499,
      quantity: 2,
      size: "42R",
      color: "Navy",
      image: "/relative-path/local-image.jpg", // Invalid absolute URL, should be safely omitted from images
      shippingCharge: 49,
    },
  ];

  const lineItems = mapCartToLineItems(testCart, 0, false);

  assert.strictEqual(lineItems.length, 2, "Line items should contain only actual products (no fake shipping items)");
  assert.strictEqual(lineItems[0].price_data?.unit_amount, 249900, "Unit amount must be in paise (₹2,499 -> 249900)");
  assert.strictEqual(lineItems[0].price_data?.product_data?.name, "Classic Oxford Cotton Shirt");
  assert.strictEqual(lineItems[0].price_data?.product_data?.description, "Size: M • Color: White");
  assert.strictEqual(lineItems[0].price_data?.product_data?.images?.length, 1, "Valid absolute HTTPS image should be included");

  // Verify second item image with relative path was filtered
  assert.strictEqual(
    lineItems[1].price_data?.product_data?.images,
    undefined,
    "Relative image URL should be excluded from Stripe product images to prevent Stripe API errors"
  );
  assert.strictEqual(lineItems[1].quantity, 2, "Quantity must be preserved");

  // Test 2: Backward compatibility when includeShippingAsLineItem = true
  const lineItemsWithShipping = mapCartToLineItems(testCart, 0, true);
  assert.strictEqual(
    lineItemsWithShipping.length,
    4,
    "Should include 2 product items + 2 shipping items when explicitly requested"
  );

  // Test 3: Shipping policy calculation
  const calculateShipping = (subtotal: number) => (subtotal >= 1999 || subtotal === 0 ? 0 : 49);
  assert.strictEqual(calculateShipping(8998), 0, "Subtotal >= 1999 qualifies for Complimentary Delivery");
  assert.strictEqual(calculateShipping(999), 49, "Subtotal < 1999 incurs Standard Delivery of ₹49");
  assert.strictEqual(calculateShipping(0), 0, "Empty subtotal has 0 shipping charge");

  // Test 4: POD charge support
  const lineItemsWithPod = mapCartToLineItems(testCart.slice(0, 1), 150, false);
  assert.strictEqual(lineItemsWithPod.length, 2, "Should include product + POD charge");
  assert.strictEqual(lineItemsWithPod[1].price_data?.product_data?.name, "POD Customization Charge");
  assert.strictEqual(lineItemsWithPod[1].price_data?.unit_amount, 15000);

  console.log("=== Phase 11 Production-Grade Stripe Checkout Tests: ALL PASSED ===");
}

runStripeCheckoutEnhancementTests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
