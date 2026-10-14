import "dotenv/config";
import assert from "node:assert";
import { db } from "@needlon/db";
import { usersTable } from "@needlon/db/db/schema/users";
import { orders } from "@needlon/db/db/schema/orders/table";
import { orderItems } from "@needlon/db/db/schema/orders/order-items/table";
import { seller } from "@needlon/db/db/schema/seller";
import { sellerStore } from "@needlon/db/db/schema/seller/seller-store";
import { OrderRepository } from "../client-modules/orders/repositories/order-repository";
import { groupOrderItems } from "../client-modules/orders/services/orderTransformer";
import { addOrderMediaRepo, createInStoreOrderRepo, updateTailoringStageRepo } from "@needlon/modules/modules/customers/repository/customer.repository";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";

async function runBespokeOrderMediaTest() {
  console.log("--> Starting Bespoke Orders Accordion & Media Upload Verification Test...");

  const testUserId = randomUUID();
  const testSellerId = randomUUID();
  const testStoreId = randomUUID();
  let createdOrderId: string | undefined;

  try {
    // 1. Setup User and Seller
    console.log("1. Setting up test buyer, seller, and atelier store...");
    await db.insert(usersTable).values({
      id: testUserId,
      name: "Bespoke Patron",
      email: `patron-${Date.now()}@example.com`,
    });

    await db.insert(seller).values({
      id: testSellerId,
      name: "Master Tailor",
      email: `tailor-${Date.now()}@example.com`,
      password: "password123",
      storeName: "Elite Bespoke Atelier",
    });

    await db.insert(sellerStore).values({
      id: testStoreId,
      sellerId: testSellerId,
      storeName: "Elite Bespoke Atelier",
      storeSlug: `atelier-${Date.now()}`,
    });

    // 2. Create In-Store Bespoke Order with initial craft photo
    console.log("2. Creating In-Store bespoke order with initial photo...");
    const initialCraftPhoto = "https://images.example.com/bespoke-suit-baste-1.jpg";
    const inStoreOrder = await createInStoreOrderRepo(testSellerId, {
      customerId: testUserId,
      garmentName: "Bespoke Hand-Stitched Sherwani",
      amount: 15000,
      tailoringNotes: "Golden silk collar with zardozi embroidery",
      mediaUrls: [initialCraftPhoto],
    });

    createdOrderId = inStoreOrder.id;
    assert.ok(createdOrderId, "In-store order should return a valid orderId");
    console.log(`✓ In-store bespoke order created: ${createdOrderId} (${inStoreOrder.orderNumber})`);

    // 3. Verify Client Orders Query Does NOT Return Catalog Dummy Images
    console.log("3. Verifying client raw orders query returns real craft media and no dummy catalog image...");
    const rawOrders = await OrderRepository.getRawUserOrders(testUserId);
    assert.strictEqual(rawOrders.length, 1, "Should find 1 order for buyer");
    
    const clientOrder = rawOrders[0];
    console.log("Fetched client order item image:", clientOrder.image);
    console.log("Fetched client order mediaUrls:", clientOrder.mediaUrls);

    // Verify image is either the craft photo or null, NEVER a fake catalog image
    assert.ok(
      clientOrder.image === initialCraftPhoto || clientOrder.image === null || clientOrder.image === undefined,
      "Client order image must be the uploaded craft photo or null, never an unassociated catalog image"
    );
    assert.ok(
      Array.isArray(clientOrder.mediaUrls) && clientOrder.mediaUrls.includes(initialCraftPhoto),
      "clientOrder.mediaUrls must contain the initial craft photo"
    );

    // 4. Test Post-Order Craft Video Upload (Swinging video / Craft proof)
    console.log("4. Testing seller adding swinging video / craft proof media to created order...");
    const swingingVideoUrl = "https://videos.example.com/atelier-sherwani-swinging-cut.mp4";
    const mediaResult = await addOrderMediaRepo(
      testSellerId,
      createdOrderId,
      swingingVideoUrl,
      "Final hand-stitched swinging drape test complete"
    );

    assert.ok(mediaResult.mediaUrls.includes(swingingVideoUrl), "Order mediaUrls must include new video");
    console.log(`✓ Media successfully appended. Total craft media items: ${mediaResult.mediaUrls.length}`);

    // Verify client order detail reflects the added video
    const orderDetail = await OrderRepository.getOrderDetail(createdOrderId, testUserId);
    assert.ok(orderDetail && orderDetail.length > 0, "OrderDetail should be retrieved successfully");
    assert.ok(
      (orderDetail[0] as any).mediaUrls?.includes(swingingVideoUrl),
      "OrderDetail must reflect newly appended craft video"
    );
    console.log("✓ Client OrderDetail contains craft swinging video");

    // 5. Test Bespoke 9-Stage Pipeline Advancement
    console.log("5. Testing 9 Bespoke Tailoring Milestones progression...");
    const milestones = [
      "ORDER_PLACED",
      "MEASUREMENT_VERIFIED",
      "PATTERN_DRAFTING",
      "IN_CUTTING",
      "TRIAL_FITTING",
      "FINAL_STITCH",
      "QUALITY_INSPECTION",
      "READY_FOR_PICKUP",
      "COMPLETED",
    ];

    for (const stage of milestones) {
      const updated = await updateTailoringStageRepo(
        testSellerId,
        createdOrderId,
        {
          stage: stage as any,
          notes: `Progressing stage to ${stage}`,
        }
      );
      assert.strictEqual(updated.tailoringStage, stage, `Order stage should be updated to ${stage}`);
    }
    console.log("✓ All 9 Bespoke Tailoring Milestones progressed successfully!");

    // 6. Test Grouped Order Items Transformer with mediaUrls
    console.log("6. Testing groupOrderItems preserves mediaUrls...");
    const grouped = groupOrderItems(rawOrders);
    assert.strictEqual(grouped.length, 1);
    assert.ok(
      Array.isArray((grouped[0].items[0] as any).mediaUrls),
      "Grouped order item must preserve mediaUrls array"
    );
    console.log("✓ groupOrderItems preserves mediaUrls for UI accordion and craft gallery");

    console.log("\n=======================================================");
    console.log("🎉 ALL BESPOKE ACCORDION & MEDIA TESTS PASSED SUCCESSFULLY!");
    console.log("=======================================================\n");

  } finally {
    // Cleanup test records safely
    console.log("Cleaning up test records...");
    try {
      if (createdOrderId) {
        await db.execute(sql`DELETE FROM notifications WHERE reference_id = ${createdOrderId}`);
        await db.execute(sql`DELETE FROM order_status_history WHERE order_id = ${createdOrderId}`);
        await db.execute(sql`DELETE FROM order_items WHERE order_id = ${createdOrderId}`);
        await db.execute(sql`DELETE FROM product_orders WHERE id = ${createdOrderId}`);
      }
      await db.execute(sql`DELETE FROM product_orders WHERE seller_id = ${testSellerId}`);
      await db.execute(sql`DELETE FROM seller_customers WHERE seller_id = ${testSellerId}`);
      await db.execute(sql`DELETE FROM seller_store WHERE seller_id = ${testSellerId}`);
      await db.execute(sql`DELETE FROM seller_addresses WHERE seller_id = ${testSellerId}`);
      await db.execute(sql`DELETE FROM seller WHERE id = ${testSellerId}`);
      await db.execute(sql`DELETE FROM users WHERE id = ${testUserId}`);
    } catch (cleanErr) {
      console.warn("Cleanup notice:", cleanErr);
    }
    console.log("Cleanup complete.");
  }
}

runBespokeOrderMediaTest().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
