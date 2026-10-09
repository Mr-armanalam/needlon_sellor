import "dotenv/config";
import assert from "node:assert";
import { db } from "@needlon/db";
import { usersTable } from "@needlon/db/db/schema/users";
import { userAddressesTable } from "@needlon/db/db/schema/client/user-addresses";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { productVariantsTable } from "@needlon/db/db/schema/catalog/products/product-variants/table";
import { inventoryTable } from "@needlon/db/db/schema/catalog/products/inventory/table";
import { orders } from "@needlon/db/db/schema/orders/table";
import { orderItems } from "@needlon/db/db/schema/orders/order-items/table";
import { orderAddresses } from "@needlon/db/db/schema/orders/order-address";
import { orderStatusHistory } from "@needlon/db/db/schema/orders/order-status-history/table";
import { orderShipments } from "@needlon/db/db/schema/orders/order-shipments/table";
import { orderPayments } from "@needlon/db/db/schema/orders/order-payments/table";
import { seller } from "@needlon/db/db/schema/seller";
import { sellerStore } from "@needlon/db/db/schema/seller/seller-store";
import { sellerAddresses } from "@needlon/db/db/schema/seller/seller-address";
import { OrderService } from "../client-modules/orders/services/orderServices";
import { groupOrderItems } from "../client-modules/orders/services/orderTransformer";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

async function runPhase7Tests() {
  console.log("--> Starting Phase 7: Buyer Order History & Shipment Tracking Test...");

  const testUserId = randomUUID();
  const unauthorizedUserId = randomUUID();
  const testAddressId = randomUUID();
  let testOrderId: string;
  let testOrderNumber: string;
  let testProductId: string;
  let testVariantId: string | undefined;
  let initialStock = 25;

  try {
    // 1. Setup Test Buyers
    console.log("1. Creating test buyer and unauthorized user...");
    await db.insert(usersTable).values([
      {
        id: testUserId,
        name: "Aarav Mehta",
        email: `aarav-order-test-${Date.now()}@example.com`,
      },
      {
        id: unauthorizedUserId,
        name: "Unauthorized Stranger",
        email: `stranger-${Date.now()}@example.com`,
      },
    ]);

    // 2. Setup Test Shipping Address
    console.log("2. Creating test user address...");
    await db.insert(userAddressesTable).values({
      id: testAddressId,
      userId: testUserId,
      fullName: "Aarav Mehta",
      phone: "9876543210",
      addressLine1: "Tower B, Apartment 1402",
      addressLine2: "Banjara Hills, Road No. 12",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500034",
      isDefault: true,
    });

    // 3. Resolve Product & Variant
    console.log("3. Resolving catalog product and inventory stock...");
    const [existingProd] = await db
      .select({ id: productsTable.id, name: productsTable.name })
      .from(productsTable)
      .limit(1);

    if (!existingProd) {
      throw new Error("No products found in productsTable");
    }
    testProductId = existingProd.id;

    const [existingVar] = await db
      .select({ id: productVariantsTable.id })
      .from(productVariantsTable)
      .where(eq(productVariantsTable.productId, testProductId))
      .limit(1);

    if (existingVar) {
      testVariantId = existingVar.id;
      const [inv] = await db
        .select({ quantity: inventoryTable.quantity })
        .from(inventoryTable)
        .where(eq(inventoryTable.variantId, testVariantId))
        .limit(1);
      if (inv) {
        initialStock = inv.quantity;
      }
    }

    // 4. Resolve Seller, Store, and Seller Warehouse Dispatch Address
    console.log("4. Resolving seller and store infrastructure...");
    let [sellerRecord] = await db.select().from(seller).limit(1);
    if (!sellerRecord) {
      [sellerRecord] = await db
        .insert(seller)
        .values({
          name: "Needlon Flagship Seller",
          email: `seller-platform-${Date.now()}@needlon.com`,
        })
        .returning();
    }

    let [storeRecord] = await db.select().from(sellerStore).limit(1);
    if (!storeRecord) {
      [storeRecord] = await db
        .insert(sellerStore)
        .values({
          sellerId: sellerRecord.id,
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
          sellerId: sellerRecord.id,
          label: "Central Warehouse Hub",
          addressType: "WAREHOUSE",
          addressLine1: "Needlon Logistics Center, Sector 62",
          city: "Noida",
          district: "Gautam Buddha Nagar",
          state: "Uttar Pradesh",
          postalCode: "201301",
        })
        .returning();
    }

    // 5. Create Order with Items, Address, Status History, and Shipment
    console.log("5. Seeding full test order with shipments & timeline...");
    testOrderNumber = `ORD-${Date.now()}-TEST7`;
    const [createdOrder] = await db
      .insert(orders)
      .values({
        sellerId: sellerRecord.id,
        buyerId: testUserId,
        storeId: storeRecord.id,
        shippingAddressId: sellerAddressRecord.id,
        orderNumber: testOrderNumber,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        paymentMethod: "CARD",
        currency: "INR",
        buyerName: "Aarav Mehta",
        buyerEmail: `aarav-order-test-${Date.now()}@example.com`,
        buyerPhone: "9876543210",
        subtotal: "4998.00",
        discountAmount: "0.00",
        couponDiscount: "0.00",
        shippingCharge: "49.00",
        taxAmount: "0.00",
        grandTotal: "5047.00",
      })
      .returning();

    testOrderId = createdOrder.id;

    // Snapshot Address
    await db.insert(orderAddresses).values({
      orderId: testOrderId,
      addressType: "DELIVERY",
      recipientName: "Aarav Mehta",
      phoneNumber: "9876543210",
      addressLine1: "Tower B, Apartment 1402",
      addressLine2: "Banjara Hills, Road No. 12",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500034",
      country: "India",
    });

    // Snapshot Order Item
    await db.insert(orderItems).values({
      orderId: testOrderId,
      sellerId: sellerRecord.id,
      productId: testProductId,
      variantId: testVariantId || null,
      sku: `SKU-${testOrderNumber.slice(0, 10)}`,
      productSlug: "merino-wool-blazer",
      productName: "Merino Wool Blend Blazer",
      variantName: "Size: 40R",
      unitPrice: "4998.00",
      quantity: 1,
      subtotal: "4998.00",
      total: "4998.00",
      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
    });

    // Seed Order Status History
    await db.insert(orderStatusHistory).values([
      {
        orderId: testOrderId,
        sellerId: sellerRecord.id,
        changedByUserId: testUserId,
        fromStatus: null,
        toStatus: "PENDING",
        action: "CREATED",
        source: "BUYER",
        result: "SUCCESS",
        reason: "Customer placed the order",
      },
      {
        orderId: testOrderId,
        sellerId: sellerRecord.id,
        changedByUserId: null,
        fromStatus: "PENDING",
        toStatus: "CONFIRMED",
        action: "ACCEPTED",
        source: "SELLER",
        result: "SUCCESS",
        reason: "Seller verified stock and accepted order",
      },
    ]);

    // Seed Order Shipment
    await db.insert(orderShipments).values({
      orderId: testOrderId,
      sellerId: sellerRecord.id,
      shipmentNumber: `SHP-${Date.now()}`,
      shipmentStatus: "PENDING",
      carrier: "OTHER",
      carrierName: "Delhivery Express",
      trackingNumber: "DLV99283741029",
      trackingUrl: "https://delhivery.com/track/DLV99283741029",
    });

    console.log(`✓ Test order seeded: ${testOrderNumber} (ID: ${testOrderId})`);

    // 6. Test Order History Query via OrderService.getRawUserOrders
    console.log("6. Testing buyer order history query and search filtering...");
    const rawOrders = await OrderService.getRawUserOrders(testUserId);
    assert.ok(rawOrders.length >= 1, "Buyer should have at least 1 order");
    assert.strictEqual(rawOrders[0].orderNumber, testOrderNumber, "Order number must match");
    assert.strictEqual(rawOrders[0].productName, "Merino Wool Blend Blazer", "Product name must match");
    assert.strictEqual(rawOrders[0].total, 5047, "Grand total must match");

    // Test Search Filter by Order Number
    const searchByNum = await OrderService.getRawUserOrders(testUserId, testOrderNumber);
    assert.strictEqual(searchByNum.length, 1, "Search by exact order number must return 1 result");

    // Test Search Filter by Product Name
    const searchByProd = await OrderService.getRawUserOrders(testUserId, "Merino Wool");
    assert.strictEqual(searchByProd.length, 1, "Search by product name must return matching order");

    // Test Search Filter with Non-Existent query
    const searchEmpty = await OrderService.getRawUserOrders(testUserId, "NON_EXISTENT_QUERY_XYZ");
    assert.strictEqual(searchEmpty.length, 0, "Non-matching search must return empty list");
    console.log("✓ Order history query & search filtering verified.");

    // 7. Test DTO Transformer (groupOrderItems)
    console.log("7. Testing groupOrderItems transformation...");
    const grouped = groupOrderItems(rawOrders);
    assert.ok(grouped.length >= 1, "Grouped orders should have at least 1 group");
    const testGroup = grouped.find((g) => g.orderId === testOrderId);
    assert.ok(testGroup, "Group matching test order must exist");
    assert.strictEqual(testGroup.items.length, 1, "Group must contain order items");
    assert.strictEqual(testGroup.items[0].productName, "Merino Wool Blend Blazer");
    assert.strictEqual(testGroup.items[0].properties, "Size: 40R");
    console.log("✓ groupOrderItems transformation verified.");

    // 8. Test Order Detail & Comprehensive Shipment Tracking Timeline
    console.log("8. Testing OrderService.getOrderDetail with tracking timeline...");
    const orderDetail = await OrderService.getOrderDetail(testOrderId, testUserId);
    assert.ok(orderDetail && orderDetail.length > 0, "Order detail must return array of items");
    const itemDetail = orderDetail[0];

    // Address verification
    assert.strictEqual(itemDetail.shippingAddress.name, "Aarav Mehta");
    assert.strictEqual(itemDetail.shippingAddress.city, "Hyderabad");
    assert.strictEqual(itemDetail.shippingAddress.pincode, "500034");

    // Financial breakdown verification
    assert.strictEqual(itemDetail.totalPurchasePrice, 5047);
    assert.strictEqual(itemDetail.shippingCharge, 49);
    assert.strictEqual(itemDetail.orderStatus, "CONFIRMED");
    assert.strictEqual(itemDetail.canCancel, true, "CONFIRMED order must allow cancellation");

    // Shipment and Timeline verification
    assert.ok(itemDetail.timeline && itemDetail.timeline.length > 0, "Tracking timeline must exist");
    const confirmedStep = itemDetail.timeline.find((t: any) => t.title === "Order Confirmed");
    assert.ok(confirmedStep, "Order Confirmed step must be present");
    assert.strictEqual(confirmedStep.isActive, true, "Order Confirmed step must be active");

    const shippedStep = itemDetail.timeline.find((t: any) => t.title === "Shipped");
    assert.ok(shippedStep, "Shipped step must be present");
    assert.ok(
      shippedStep.details.some((d: string) => d.includes("Delhivery Express") || d.includes("DLV99283741029")),
      "Shipped step must incorporate shipment carrier and tracking details"
    );
    console.log("✓ Order detail, invoice breakdown & tracking timeline verified.");

    // 9. Test Buyer Ownership Check (Prevent Cross-User Order Access)
    console.log("9. Verifying buyer ownership check (cross-user access restriction)...");
    let unauthorizedCaught = false;
    try {
      await OrderService.getOrderDetail(testOrderId, unauthorizedUserId);
    } catch (err: any) {
      if (err.message?.includes("UNAUTHORIZED") || err.statusCode === 403) {
        unauthorizedCaught = true;
      }
    }
    assert.strictEqual(
      unauthorizedCaught,
      true,
      "OrderService.getOrderDetail must reject access by unauthorized buyer"
    );

    let unauthorizedCancelCaught = false;
    try {
      await OrderService.cancelOrder(testOrderId, unauthorizedUserId, "Hacking attempt");
    } catch (err: any) {
      if (err.message?.includes("UNAUTHORIZED") || err.statusCode === 403) {
        unauthorizedCancelCaught = true;
      }
    }
    assert.strictEqual(
      unauthorizedCancelCaught,
      true,
      "OrderService.cancelOrder must reject cancellation by unauthorized buyer"
    );
    console.log("✓ Buyer ownership security constraints verified.");

    // 10. Test Buyer Order Cancellation for CONFIRMED order
    console.log("10. Executing buyer order cancellation via OrderService.cancelOrder...");
    const cancelResult = await OrderService.cancelOrder(
      testOrderId,
      testUserId,
      "Changed mind before shipping"
    );
    assert.strictEqual(cancelResult.success, true, "Cancellation must succeed");
    assert.strictEqual(cancelResult.status, "CANCELLED", "Status must be CANCELLED");

    // Verify DB Status Updates
    const [cancelledOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, testOrderId))
      .limit(1);
    assert.strictEqual(cancelledOrder.status, "CANCELLED", "Database order status must be CANCELLED");
    assert.ok(cancelledOrder.cancelledAt, "cancelledAt timestamp must be populated");
    assert.strictEqual(
      cancelledOrder.paymentStatus,
      "REFUNDED",
      "Paid order should transition to REFUNDED"
    );

    // Verify Audit Trail in orderStatusHistory
    const cancelHistory = await db
      .select()
      .from(orderStatusHistory)
      .where(eq(orderStatusHistory.orderId, testOrderId));
    const cancelAudit = cancelHistory.find((h) => h.toStatus === "CANCELLED");
    assert.ok(cancelAudit, "Audit record for CANCELLED transition must be present");
    assert.strictEqual(cancelAudit.action, "CANCELLED");
    assert.strictEqual(cancelAudit.source, "BUYER");
    assert.strictEqual(cancelAudit.reason, "Changed mind before shipping");

    // Verify Re-cancelling rejected
    let repeatCancelCaught = false;
    try {
      await OrderService.cancelOrder(testOrderId, testUserId, "Repeat cancel");
    } catch (err: any) {
      repeatCancelCaught = true;
    }
    assert.strictEqual(
      repeatCancelCaught,
      true,
      "Cancelling an already CANCELLED order must be rejected"
    );

    // Verify Cancelled Order Detail view reflects CANCELLED timeline
    const cancelledDetail = await OrderService.getOrderDetail(testOrderId, testUserId);
    assert.ok(cancelledDetail && cancelledDetail.length > 0);
    assert.strictEqual(cancelledDetail[0].canCancel, false, "canCancel must be false when CANCELLED");
    const cancelledTimelineStep = cancelledDetail[0].timeline.find((t: any) => t.title === "Cancelled");
    assert.ok(cancelledTimelineStep, "Timeline must display Cancelled step for cancelled order");

    console.log("✓ Buyer order cancellation and inventory audit trail verified.");
    console.log("=== Phase 7 Buyer Order History & Shipment Tracking Tests: ALL PASSED ===");
  } finally {
    // 11. Cleanup test records
    console.log("Cleaning up test data...");
    if (testOrderId) {
      await db.delete(orderPayments).where(eq(orderPayments.orderId, testOrderId)).catch(() => {});
      await db.delete(orderShipments).where(eq(orderShipments.orderId, testOrderId)).catch(() => {});
      await db.delete(orderStatusHistory).where(eq(orderStatusHistory.orderId, testOrderId)).catch(() => {});
      await db.delete(orderItems).where(eq(orderItems.orderId, testOrderId)).catch(() => {});
      await db.delete(orderAddresses).where(eq(orderAddresses.orderId, testOrderId)).catch(() => {});
      await db.delete(orders).where(eq(orders.id, testOrderId)).catch(() => {});
    }
    await db.delete(userAddressesTable).where(eq(userAddressesTable.userId, testUserId)).catch(() => {});
    await db.delete(usersTable).where(eq(usersTable.id, testUserId)).catch(() => {});
    await db.delete(usersTable).where(eq(usersTable.id, unauthorizedUserId)).catch(() => {});
    console.log("Cleanup complete.");
  }
}

runPhase7Tests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Phase 7 Test Failure:", err);
    process.exit(1);
  });
