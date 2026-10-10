import "dotenv/config";
import assert from "node:assert";
import { db } from "@needlon/db";
import { usersTable } from "@needlon/db/db/schema/users";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { orders } from "@needlon/db/db/schema/orders/table";
import { orderItems } from "@needlon/db/db/schema/orders/order-items/table";
import { orderStatusHistory } from "@needlon/db/db/schema/orders/order-status-history/table";
import { reviewsTable } from "@needlon/db/db/schema/reviews/table";
import { seller } from "@needlon/db/db/schema/seller";
import { sellerStore } from "@needlon/db/db/schema/seller/seller-store";
import { sellerAddresses } from "@needlon/db/db/schema/seller/seller-address";
import { OrderRepository } from "../client-modules/orders/repositories/order-repository";
import { ReviewService } from "../client-modules/orders/services/review-services";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

async function runDynamicOrderAndReviewTests() {
  console.log("--> Starting Dynamic Order Updates & Review Validation Tests...");

  const testBuyerId = randomUUID();
  let testOrderId: string;
  let testOrderItemId: string;
  let testProductId: string;
  let testSellerId: string;
  let testReviewId: string | undefined;

  try {
    // 1. Setup Buyer User
    console.log("1. Creating test buyer user...");
    await db.insert(usersTable).values({
      id: testBuyerId,
      name: "Arman Dynamic Tester",
      email: `tester-${Date.now()}@example.com`,
    });

    // 2. Resolve Product
    console.log("2. Finding catalog product...");
    const [existingProd] = await db.select({ id: productsTable.id }).from(productsTable).limit(1);
    if (!existingProd) throw new Error("No products in database");
    testProductId = existingProd.id;

    // 3. Resolve Seller
    let [sellerRecord] = await db.select().from(seller).limit(1);
    if (!sellerRecord) {
      [sellerRecord] = await db
        .insert(seller)
        .values({
          name: "Needlon Seller Hub",
          email: `seller-hub-${Date.now()}@needlon.com`,
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
          storeName: "Needlon Store",
          storeSlug: `needlon-store-${Date.now()}`,
        })
        .returning();
    }

    let [sellerAddr] = await db.select().from(sellerAddresses).limit(1);
    if (!sellerAddr) {
      [sellerAddr] = await db
        .insert(sellerAddresses)
        .values({
          sellerId: testSellerId,
          label: "Warehouse Main",
          addressType: "WAREHOUSE",
          addressLine1: "Plot 42",
          city: "Delhi",
          state: "Delhi",
          postalCode: "110001",
        })
        .returning();
    }

    // 4. Create Order in PENDING status
    console.log("4. Creating test order in PENDING status...");
    const [newOrder] = await db
      .insert(orders)
      .values({
        sellerId: testSellerId,
        buyerId: testBuyerId,
        storeId: storeRecord.id,
        shippingAddressId: sellerAddr.id,
        orderNumber: `ORD-DYN-${Date.now()}`,
        status: "PENDING",
        paymentStatus: "PAID",
        paymentMethod: "UPI",
        buyerName: "Arman Dynamic Tester",
        buyerEmail: `tester-${Date.now()}@example.com`,
        buyerPhone: "9876543210",
        subtotal: "1850.00",
        grandTotal: "1850.00",
      })
      .returning();
    testOrderId = newOrder.id;

    const [itemRecord] = await db
      .insert(orderItems)
      .values({
        orderId: testOrderId,
        sellerId: testSellerId,
        productId: testProductId,
        sku: `SKU-DYN-${Date.now().toString().slice(-6)}`,
        productSlug: "casual-floral-western-dress",
        productName: "Casual Floral Western Dress",
        unitPrice: "1850.00",
        quantity: 1,
        subtotal: "1850.00",
        total: "1850.00",
      })
      .returning();
    testOrderItemId = itemRecord.id;

    // 5. Insert history logs simulating dynamic order progression from database
    console.log("5. Appending dynamic order status history logs to database...");
    await db.insert(orderStatusHistory).values([
      {
        orderId: testOrderId,
        sellerId: testSellerId,
        fromStatus: null,
        toStatus: "PENDING",
        action: "CREATED",
        remarks: "Order created successfully by buyer",
      },
      {
        orderId: testOrderId,
        sellerId: testSellerId,
        fromStatus: "PENDING",
        toStatus: "CONFIRMED",
        action: "ACCEPTED",
        remarks: "Seller confirmed order and began processing",
      },
      {
        orderId: testOrderId,
        sellerId: testSellerId,
        fromStatus: "CONFIRMED",
        toStatus: "PROCESSING",
        action: "PACKED",
        remarks: "Garment tailored and packed into protective apparel bag",
      },
      {
        orderId: testOrderId,
        sellerId: testSellerId,
        fromStatus: "PROCESSING",
        toStatus: "READY_TO_SHIP",
        action: "READY_FOR_SHIPMENT",
        remarks: "Handed over to carrier manifest",
      },
    ]);

    // Update order status to READY_TO_SHIP
    await db.update(orders).set({ status: "READY_TO_SHIP" }).where(eq(orders.id, testOrderId));

    // 6. Test that buildTimeline reflects dynamic database history
    console.log("6. Verifying OrderRepository.getOrderDetail timeline is dynamic from database...");
    const orderDetails = await OrderRepository.getOrderDetail(testOrderId, testBuyerId);
    assert.ok(orderDetails && orderDetails.length > 0, "Order details should be found");
    const timeline = orderDetails[0].timeline;
    assert.ok(Array.isArray(timeline), "Timeline must be an array");
    assert.strictEqual(timeline[0].title, "Order Confirmed");
    assert.strictEqual(timeline[0].isActive, true);

    // Verify packed and ready remarks are included
    const confirmedStepDetails = timeline[0].details.join(" ");
    assert.ok(
      confirmedStepDetails.includes("packed") || confirmedStepDetails.includes("Package is ready"),
      "Dynamic remarks from orderStatusHistory must be included in timeline details"
    );
    console.log("✓ Dynamic timeline status and remarks verified from database.");

    // 7. Test Review Submission with orderItemId and database persistence
    console.log("7. Testing review submission and database reflection...");
    const reviewResult = await ReviewService.createReview({
      orderItemId: testOrderItemId,
      productId: testProductId,
      userId: testBuyerId,
      rating: 5,
      comment: "Incredible fitting and premium fabric. Arrived in perfect condition!",
      allowEarlyReview: true,
    });

    assert.ok(reviewResult && reviewResult.id, "Review must be created with ID");
    testReviewId = reviewResult.id;
    assert.strictEqual(reviewResult.orderItemId, testOrderItemId, "Returned review must have orderItemId");

    // 8. Verify the review exists in Postgres database
    console.log("8. Verifying review record is stored in reviewsTable in database...");
    const [dbReview] = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.id, testReviewId))
      .limit(1);

    assert.ok(dbReview, "Review must be found in reviewsTable");
    assert.strictEqual(dbReview.rating, 5);
    assert.strictEqual(dbReview.content, "Incredible fitting and premium fabric. Arrived in perfect condition!");
    assert.strictEqual((dbReview.metadata as any)?.orderItemId, testOrderItemId);
    console.log("✓ Database record verified with matching orderItemId metadata.");

    // 9. Verify getProductReviews returns orderItemId top-level for client OrderRating matching
    console.log("9. Verifying ReviewService.getProductReviews returns orderItemId top-level...");
    const prodReviews = await ReviewService.getProductReviews(testProductId);
    const matchedClientReview = prodReviews.reviews.find((r: any) => r.orderItemId === testOrderItemId);
    assert.ok(matchedClientReview, "Product reviews list must contain review with orderItemId for client matching");
    assert.strictEqual(matchedClientReview.rating, 5);
    console.log("✓ getProductReviews returned orderItemId for seamless UI experience.");

    console.log("=== ALL DYNAMIC ORDER & REVIEW TESTS PASSED SUCCESSFULLY ===");
  } finally {
    console.log("Cleaning up test records...");
    if (testReviewId) {
      await db.delete(reviewsTable).where(eq(reviewsTable.id, testReviewId)).catch(() => {});
    }
    if (testOrderId) {
      await db.delete(orderStatusHistory).where(eq(orderStatusHistory.orderId, testOrderId)).catch(() => {});
      await db.delete(orderItems).where(eq(orderItems.orderId, testOrderId)).catch(() => {});
      await db.delete(orders).where(eq(orders.id, testOrderId)).catch(() => {});
    }
    if (testBuyerId) {
      await db.delete(usersTable).where(eq(usersTable.id, testBuyerId)).catch(() => {});
    }
    console.log("Cleanup complete.");
  }
}

runDynamicOrderAndReviewTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
  });
