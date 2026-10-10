import "dotenv/config";
import assert from "node:assert";
import { db } from "@needlon/db";
import { usersTable } from "@needlon/db/db/schema/users";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { orders } from "@needlon/db/db/schema/orders/table";
import { orderItems } from "@needlon/db/db/schema/orders/order-items/table";
import { orderAddresses } from "@needlon/db/db/schema/orders/order-address";
import { reviewsTable } from "@needlon/db/db/schema/reviews/table";
import { seller } from "@needlon/db/db/schema/seller";
import { sellerStore } from "@needlon/db/db/schema/seller/seller-store";
import { sellerAddresses } from "@needlon/db/db/schema/seller/seller-address";
import { ReviewService } from "../client-modules/orders/services/review-services";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

async function runPhase8Tests() {
  console.log("--> Starting Phase 8: Verified Buyer Product Reviews & Ratings Test...");

  const testBuyerId = randomUUID();
  const strangerBuyerId = randomUUID();
  let testOrderId: string;
  let testProductId: string;
  let testSellerId: string;
  let testReviewId1: string | undefined;
  let testReviewId2: string | undefined;

  try {
    // 1. Setup Users
    console.log("1. Creating test buyer and stranger users...");
    await db.insert(usersTable).values([
      {
        id: testBuyerId,
        name: "Verified Reviewer",
        email: `verified-reviewer-${Date.now()}@example.com`,
      },
      {
        id: strangerBuyerId,
        name: "Non-Buyer Stranger",
        email: `stranger-rev-${Date.now()}@example.com`,
      },
    ]);

    // 2. Resolve Product
    console.log("2. Finding catalog product...");
    const [existingProd] = await db.select({ id: productsTable.id }).from(productsTable).limit(1);
    if (!existingProd) throw new Error("No products in database");
    testProductId = existingProd.id;

    // 3. Resolve Seller Infrastructure
    let [sellerRecord] = await db.select().from(seller).limit(1);
    if (!sellerRecord) {
      [sellerRecord] = await db
        .insert(seller)
        .values({
          name: "Needlon Reviews Flagship",
          email: `seller-rev-${Date.now()}@needlon.com`,
        })
        .returning();
    }
    testSellerId = sellerRecord.id;

    let [storeRecord] = await db.select().from(sellerStore).limit(1);
    if (!storeRecord) {
      [storeRecord] = await db
        .insert(sellerStore)
        .values({
          sellerId: testSellerId,
          storeName: "Needlon Official Store",
          storeSlug: `needlon-official-${Date.now()}`,
        })
        .returning();
    }

    let [sellerAddressRecord] = await db.select().from(sellerAddresses).limit(1);
    if (!sellerAddressRecord) {
      [sellerAddressRecord] = await db
        .insert(sellerAddresses)
        .values({
          sellerId: testSellerId,
          label: "Warehouse 1",
          addressType: "WAREHOUSE",
          addressLine1: "Hub 1",
          city: "Noida",
          district: "Gautam Buddha Nagar",
          state: "Uttar Pradesh",
          postalCode: "201301",
        })
        .returning();
    }

    // 4. Create Order in CONFIRMED state (not delivered yet)
    console.log("4. Creating test order in CONFIRMED state...");
    const [newOrder] = await db
      .insert(orders)
      .values({
        sellerId: testSellerId,
        buyerId: testBuyerId,
        storeId: storeRecord.id,
        shippingAddressId: sellerAddressRecord.id,
        orderNumber: `ORD-REV-${Date.now()}`,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        paymentMethod: "CARD",
        buyerName: "Verified Reviewer",
        buyerEmail: `verified-reviewer-${Date.now()}@example.com`,
        buyerPhone: "9876543210",
        subtotal: "2499.00",
        grandTotal: "2499.00",
      })
      .returning();
    testOrderId = newOrder.id;

    const [orderItemRecord] = await db
      .insert(orderItems)
      .values({
        orderId: testOrderId,
        sellerId: testSellerId,
        productId: testProductId,
        sku: `SKU-REV-${Date.now().toString().slice(-6)}`,
        productSlug: "luxury-garment",
        productName: "Luxury Tailored Garment",
        unitPrice: "2499.00",
        quantity: 1,
        subtotal: "2499.00",
        total: "2499.00",
      })
      .returning();

    // 5. Test Verified Purchase Enforcement: Non-Purchaser Attempt
    console.log("5. Testing verified purchase enforcement for stranger...");
    let strangerRejected = false;
    try {
      await ReviewService.createReview({
        productId: testProductId,
        userId: strangerBuyerId,
        rating: 5,
        comment: "I never bought this product!",
      });
    } catch (err: any) {
      if (err.statusCode === 403 || err.message?.includes("Verified purchase required")) {
        strangerRejected = true;
      }
    }
    assert.strictEqual(strangerRejected, true, "Non-purchaser review must be rejected with 403");
    console.log("✓ Non-purchaser review rejection verified.");

    // 6. Test Verified Purchase Enforcement: Purchased but Not Delivered Yet
    console.log("6. Testing undelivered order review rejection...");
    let undeliveredRejected = false;
    try {
      await ReviewService.createReview({
        orderItemId: orderItemRecord.id,
        productId: testProductId,
        userId: testBuyerId,
        rating: 5,
        comment: "Order is still in transit, trying to review early",
      });
    } catch (err: any) {
      if (err.statusCode === 400 || err.message?.includes("DELIVERED")) {
        undeliveredRejected = true;
      }
    }
    assert.strictEqual(undeliveredRejected, true, "Undelivered order review must be rejected with 400");
    console.log("✓ Undelivered order review rejection verified.");

    // 7. Transition Order to DELIVERED
    console.log("7. Updating order status to DELIVERED...");
    await db
      .update(orders)
      .set({ status: "DELIVERED", deliveredAt: new Date() })
      .where(eq(orders.id, testOrderId));

    // 8. Test Verified Review Submission
    console.log("8. Submitting verified review for DELIVERED order...");
    const reviewResult1 = await ReviewService.createReview({
      orderItemId: orderItemRecord.id,
      productId: testProductId,
      userId: testBuyerId,
      rating: 5,
      comment: "Exceptional fabric and stitching quality! Fits like a glove.",
      title: "Best bespoke blazer ever",
    });

    assert.ok(reviewResult1.id, "Review ID must be generated");
    testReviewId1 = reviewResult1.id;
    assert.strictEqual(reviewResult1.isVerifiedBuyer, true, "Review must be marked as verified buyer");
    assert.strictEqual(reviewResult1.rating, 5);
    console.log(`✓ Verified review 1 created: ${reviewResult1.id} (Rating: ${reviewResult1.rating}★)`);

    // 9. Add second review to test rating aggregation
    console.log("9. Submitting second review for rating calculation...");
    const reviewResult2 = await db
      .insert(reviewsTable)
      .values({
        sellerId: testSellerId,
        buyerId: testBuyerId,
        productId: testProductId,
        rating: 4,
        title: "Very comfortable fit",
        content: "Great styling, will buy again in different color.",
        isVerifiedBuyer: true,
        status: "PUBLISHED",
      })
      .returning();
    testReviewId2 = reviewResult2[0].id;
    console.log(`✓ Review 2 created: ${testReviewId2} (Rating: 4★)`);

    // 10. Test Rating Calculation and Distribution
    console.log("10. Computing real-time rating average and distribution...");
    const stats = await ReviewService.getProductReviews(testProductId);
    assert.ok(stats.reviewCount >= 2, "Product review count should be at least 2");
    assert.strictEqual(stats.distribution[5] >= 1, true, "Distribution of 5★ must be >= 1");
    assert.strictEqual(stats.distribution[4] >= 1, true, "Distribution of 4★ must be >= 1");

    const expectedAverage = (
      stats.reviews.reduce((acc, r) => acc + r.rating, 0) / stats.reviewCount
    ).toFixed(1);
    assert.strictEqual(stats.averageRating, expectedAverage, "Computed average rating must match");
    console.log(`✓ Rating computation verified: Average ${stats.averageRating}★ from ${stats.reviewCount} reviews`);

    console.log("=== Phase 8 Verified Reviews & Ratings Tests: ALL PASSED ===");
  } finally {
    console.log("Cleaning up Phase 8 test data...");
    if (testReviewId1) {
      await db.delete(reviewsTable).where(eq(reviewsTable.id, testReviewId1)).catch(() => {});
    }
    if (testReviewId2) {
      await db.delete(reviewsTable).where(eq(reviewsTable.id, testReviewId2)).catch(() => {});
    }
    if (testOrderId) {
      await db.delete(orderItems).where(eq(orderItems.orderId, testOrderId)).catch(() => {});
      await db.delete(orderAddresses).where(eq(orderAddresses.orderId, testOrderId)).catch(() => {});
      await db.delete(orders).where(eq(orders.id, testOrderId)).catch(() => {});
    }
    await db.delete(usersTable).where(eq(usersTable.id, testBuyerId)).catch(() => {});
    await db.delete(usersTable).where(eq(usersTable.id, strangerBuyerId)).catch(() => {});
    console.log("Cleanup complete.");
  }
}

runPhase8Tests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Phase 8 Test Failure:", err);
    process.exit(1);
  });
