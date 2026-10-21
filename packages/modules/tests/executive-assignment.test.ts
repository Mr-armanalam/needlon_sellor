/**
 * Delivery-executive system integration test (requires a live Postgres):
 *
 *   - roster creation hashes passwords, defaults to ACTIVE, rejects
 *     duplicate phones, and never exposes passwordHash in DTOs
 *   - assignment is by roster id: it writes a delivery_assignments row,
 *     sets shipment_orders.executiveId, leaves shipment notes untouched,
 *     is ownership-scoped, and rejects non-ACTIVE executives
 *   - reassignment closes the previous open row as REASSIGNED
 *   - executive session tokens verify, and fail for tampered tokens or a
 *     different secret; credential checks reject wrong passwords, unset
 *     passwords and non-ACTIVE executives
 *   - the executive status flow ACCEPTED -> PICKED_UP -> DELIVERED updates
 *     assignment timestamps, shipment status, order status and writes
 *     tracking events; out-of-order jumps and foreign assignments are
 *     rejected; FAILED records the reason and fails the shipment
 *   - the executive delivery list joins order, address and item counts
 *   - soft-deleted executives disappear from the roster
 *
 * Run (from packages/modules):
 *   DATABASE_URL=postgres://needlon:needlon@localhost:5432/needlon_test \
 *     npx tsx tests/executive-assignment.test.ts
 */
import assert from "node:assert";
import { randomUUID } from "node:crypto";
import { eq, inArray } from "drizzle-orm";

// Env MUST be set before any module that creates the DB client or reads
// the session secret is loaded — hence the dynamic imports inside main().
process.env.DATABASE_URL ??=
  "postgres://needlon:needlon@localhost:5432/needlon_test";
process.env.AUTH_SECRET ??= "executive-assignment-test-secret-0123456789";

const stamp = Date.now().toString().slice(-6);
const sellerAId = randomUUID();
const sellerBId = randomUUID();
const storeAId = randomUUID();
const addressAId = randomUUID();
const buyerId = randomUUID();
const categoryId = randomUUID();
const productId = randomUUID();
const orderAId = randomUUID();
const orderBId = randomUUID();
const orderNumber = `EXT-ORD-${stamp}`;
const orderBNumber = `EXT-ORD-B-${stamp}`;
const NOTES_SENTINEL = "KEEP-UPRIGHT-SENTINEL";
const shipmentIdsForCleanup: string[] = [];
const executiveIdsForCleanup: string[] = [];

async function main() {
  const { db } = await import("../../db/db/index");
  const { usersTable } = await import("../../db/db/schema/users");
  const { seller } = await import("../../db/db/schema/seller");
  const { sellerStore } = await import("../../db/db/schema/seller/seller-store");
  const { sellerAddresses } = await import(
    "../../db/db/schema/seller/seller-address"
  );
  const { orders } = await import("../../db/db/schema/orders/table");
  const { orderAddresses } = await import(
    "../../db/db/schema/orders/order-address"
  );
  const { orderItems } = await import(
    "../../db/db/schema/orders/order-items/table"
  );
  const { categoriesTable } = await import(
    "../../db/db/schema/catalog/categories/table"
  );
  const { productsTable } = await import(
    "../../db/db/schema/catalog/products/table"
  );
  const { shipmentOrders } = await import(
    "../../db/db/schema/delivery/shipping-orders"
  );
  const { shipmentTrackingEvents } = await import(
    "../../db/db/schema/delivery/shipping-tracking-events"
  );
  const { deliveryAssignments } = await import(
    "../../db/db/schema/delivery/delivery-assignments"
  );
  const { deliveryExecutives } = await import(
    "../../db/db/schema/delivery/delivery-executives"
  );
  const {
    getShippingPartners,
    createShipmentOrder,
    assignDeliveryExecutiveRepo,
  } = await import("../modules/delivery/repository/delivery.repository");
  const {
    createExecutive,
    listExecutives,
    getExecutiveById,
    updateExecutive,
    softDeleteExecutive,
    getExecutiveDeliveries,
    updateExecutiveAssignmentStatus,
  } = await import("../modules/delivery/repository/executive.repository");
  const { verifyExecutiveCredentials } = await import(
    "../modules/delivery/services/executive.service"
  );
  const {
    createExecutiveSessionToken,
    verifyExecutiveSessionToken,
  } = await import("../modules/delivery/lib/executive-session");

  async function cleanup() {
    if (shipmentIdsForCleanup.length > 0) {
      await db
        .delete(deliveryAssignments)
        .where(inArray(deliveryAssignments.shipmentId, shipmentIdsForCleanup));
      await db
        .delete(shipmentTrackingEvents)
        .where(
          inArray(shipmentTrackingEvents.shipmentId, shipmentIdsForCleanup),
        );
      await db
        .delete(shipmentOrders)
        .where(inArray(shipmentOrders.id, shipmentIdsForCleanup));
    }
    await db
      .delete(orderItems)
      .where(inArray(orderItems.orderId, [orderAId, orderBId]));
    await db
      .delete(orderAddresses)
      .where(inArray(orderAddresses.orderId, [orderAId, orderBId]));
    await db.delete(orders).where(inArray(orders.id, [orderAId, orderBId]));
    if (executiveIdsForCleanup.length > 0) {
      await db
        .delete(deliveryExecutives)
        .where(inArray(deliveryExecutives.id, executiveIdsForCleanup));
    }
    await db.delete(productsTable).where(eq(productsTable.id, productId));
    await db
      .delete(categoriesTable)
      .where(eq(categoriesTable.id, categoryId));
    await db.delete(sellerAddresses).where(eq(sellerAddresses.id, addressAId));
    await db.delete(sellerStore).where(eq(sellerStore.id, storeAId));
    await db.delete(usersTable).where(eq(usersTable.id, buyerId));
    await db.delete(seller).where(inArray(seller.id, [sellerAId, sellerBId]));
  }

  try {
    console.log("=== EXECUTIVE ASSIGNMENT ===");

    // Fixtures -------------------------------------------------------------
    await db.insert(seller).values([
      {
        id: sellerAId,
        name: "Executive Test Seller A",
        email: `ext-seller-a-${stamp}@example.com`,
        passwordHash: "test-hash",
      },
      {
        id: sellerBId,
        name: "Executive Test Seller B",
        email: `ext-seller-b-${stamp}@example.com`,
        passwordHash: "test-hash",
      },
    ]);
    await db.insert(sellerStore).values({
      id: storeAId,
      sellerId: sellerAId,
      storeName: "Executive Test Store",
      storeSlug: `ext-store-${stamp}`,
    });
    await db.insert(sellerAddresses).values({
      id: addressAId,
      sellerId: sellerAId,
      label: "Main",
      addressType: "PICKUP",
      addressLine1: "1 Executive Street",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411001",
    });
    await db.insert(usersTable).values({
      id: buyerId,
      name: "Executive Test Buyer",
      email: `ext-buyer-${stamp}@example.com`,
      number: "+91 9000000000",
    });
    await db.insert(orders).values([
      {
        id: orderAId,
        sellerId: sellerAId,
        buyerId,
        storeId: storeAId,
        shippingAddressId: addressAId,
        orderNumber,
        status: "PENDING",
        paymentStatus: "PAID",
        paymentMethod: "COD",
        buyerName: "Executive Test Buyer",
        buyerEmail: `ext-buyer-${stamp}@example.com`,
        buyerPhone: "9000000000",
        subtotal: "1500.00",
        grandTotal: "1500.00",
      },
      {
        id: orderBId,
        sellerId: sellerAId,
        buyerId,
        storeId: storeAId,
        shippingAddressId: addressAId,
        orderNumber: orderBNumber,
        status: "PENDING",
        paymentStatus: "PAID",
        paymentMethod: "COD",
        buyerName: "Executive Test Buyer",
        buyerEmail: `ext-buyer-${stamp}@example.com`,
        buyerPhone: "9000000000",
        subtotal: "500.00",
        grandTotal: "500.00",
      },
    ]);
    await db.insert(orderAddresses).values({
      orderId: orderAId,
      addressType: "DELIVERY",
      recipientName: "Executive Test Buyer",
      phoneNumber: "9000000000",
      addressLine1: "44 Delivery Lane",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411001",
      country: "India",
    });
    await db.insert(categoriesTable).values({
      id: categoryId,
      name: "Executive Test Category",
      slug: `ext-cat-${stamp}`,
      code: `EXT-${stamp}`,
      path: `/ext-cat-${stamp}`,
    });
    await db.insert(productsTable).values({
      id: productId,
      storeId: sellerAId,
      categoryId,
      name: "Executive Test Kurta",
      slug: `ext-kurta-${stamp}`,
      status: "PUBLISHED",
      isCustomizable: false,
    });
    await db.insert(orderItems).values({
      orderId: orderAId,
      sellerId: sellerAId,
      productId,
      sku: `EXT-SKU-${stamp}`,
      productSlug: `ext-kurta-${stamp}`,
      productName: "Executive Test Kurta",
      quantity: 3,
    });
    console.log("✓ Fixtures: sellers, store, buyer, orders, address, item");

    // (a) Roster creation --------------------------------------------------
    const exec1 = await createExecutive(
      {
        name: "Exec One",
        phone: `+91 98111${stamp}`,
        password: "exec-pass-123",
        vehicleType: "Bike / Two Wheeler",
      },
      sellerAId,
    );
    executiveIdsForCleanup.push(exec1.id);
    assert.strictEqual(exec1.status, "ACTIVE");
    assert.strictEqual(exec1.hasPassword, true);
    assert.strictEqual(exec1.createdBy, sellerAId);
    assert.ok(
      !("passwordHash" in exec1),
      "Executive DTO must never carry passwordHash",
    );

    const exec2 = await createExecutive(
      {
        name: "Exec Two",
        phone: `+91 98222${stamp}`,
        password: "exec-pass-456",
      },
      sellerAId,
    );
    executiveIdsForCleanup.push(exec2.id);

    const suspended = await createExecutive(
      {
        name: "Exec Suspended",
        phone: `+91 98333${stamp}`,
        password: "exec-pass-789",
        status: "SUSPENDED",
      },
      sellerAId,
    );
    executiveIdsForCleanup.push(suspended.id);
    assert.strictEqual(suspended.status, "SUSPENDED");

    const noPassword = await createExecutive(
      { name: "Exec No Password", phone: `+91 98444${stamp}` },
      sellerAId,
    );
    executiveIdsForCleanup.push(noPassword.id);
    assert.strictEqual(noPassword.hasPassword, false);

    await assert.rejects(
      () =>
        createExecutive(
          { name: "Duplicate Phone", phone: exec1.phone },
          sellerAId,
        ),
      /already exists/,
      "Duplicate phone must be rejected with a clear error",
    );
    console.log("✓ (a) roster create: hashing, ACTIVE default, duplicate phone rejected");

    // (b) Assignment -------------------------------------------------------
    const partners = await getShippingPartners();
    const inhouse = partners.find((p) => p.partnerCode === "INHOUSE");
    assert.ok(inhouse, "INHOUSE partner must be seeded");
    const shipment = await createShipmentOrder(sellerAId, {
      orderId: orderAId,
      shippingPartnerId: inhouse.id,
      shippingCost: 0,
      codAmount: 1500,
      notes: NOTES_SENTINEL,
    });
    shipmentIdsForCleanup.push(shipment.id);

    await assert.rejects(
      () => assignDeliveryExecutiveRepo(shipment.id, sellerBId, exec1.id),
      /Shipment not found for this seller/,
      "Another seller must not assign executives to this shipment",
    );
    await assert.rejects(
      () => assignDeliveryExecutiveRepo(shipment.id, sellerAId, suspended.id),
      /is not active/,
      "A SUSPENDED executive must not be assignable",
    );

    const firstAssign = await assignDeliveryExecutiveRepo(
      shipment.id,
      sellerAId,
      exec1.id,
    );
    assert.ok(firstAssign.assignment, "Assignment must be returned");
    assert.strictEqual(firstAssign.assignment?.status, "ASSIGNED");
    assert.strictEqual(firstAssign.assignment?.assignedBy, sellerAId);
    assert.strictEqual(firstAssign.assignment?.orderId, orderAId);
    assert.strictEqual(firstAssign.shipment?.executiveId, exec1.id);
    assert.strictEqual(
      firstAssign.shipment?.notes,
      NOTES_SENTINEL,
      "Assignment must not overwrite shipment notes",
    );
    console.log("✓ (b) assignment writes delivery_assignments + executiveId; notes untouched");

    // (c) Reassignment -----------------------------------------------------
    const secondAssign = await assignDeliveryExecutiveRepo(
      shipment.id,
      sellerAId,
      exec2.id,
    );
    const assignmentRows = await db
      .select()
      .from(deliveryAssignments)
      .where(eq(deliveryAssignments.shipmentId, shipment.id));
    assert.strictEqual(assignmentRows.length, 2);
    const firstRow = assignmentRows.find(
      (r) => r.id === firstAssign.assignment?.id,
    );
    const secondRow = assignmentRows.find(
      (r) => r.id === secondAssign.assignment?.id,
    );
    assert.strictEqual(firstRow?.status, "REASSIGNED");
    assert.strictEqual(secondRow?.status, "ASSIGNED");
    assert.strictEqual(secondAssign.shipment?.executiveId, exec2.id);
    console.log("✓ (c) reassignment closes the previous row as REASSIGNED");

    // (d) Session token + credentials --------------------------------------
    const token = await createExecutiveSessionToken(exec2.id);
    const verified = await verifyExecutiveSessionToken(token);
    assert.strictEqual(verified?.executiveId, exec2.id);

    const tampered = `${token.slice(0, -2)}xx`;
    assert.strictEqual(await verifyExecutiveSessionToken(tampered), null);

    const realSecret = process.env.AUTH_SECRET;
    process.env.AUTH_SECRET = "a-completely-different-secret";
    try {
      assert.strictEqual(
        await verifyExecutiveSessionToken(token),
        null,
        "Token must fail under a different secret",
      );
    } finally {
      process.env.AUTH_SECRET = realSecret;
    }

    const loggedIn = await verifyExecutiveCredentials(
      exec2.phone,
      "exec-pass-456",
    );
    assert.strictEqual(loggedIn.id, exec2.id);
    await assert.rejects(
      () => verifyExecutiveCredentials(exec2.phone, "wrong-password"),
      /Invalid phone number or password/,
    );
    await assert.rejects(
      () => verifyExecutiveCredentials(noPassword.phone, "anything-123"),
      /Password not set/,
    );
    await assert.rejects(
      () => verifyExecutiveCredentials(suspended.phone, "exec-pass-789"),
      /Invalid phone number or password/,
      "A SUSPENDED executive must not be able to log in",
    );
    console.log("✓ (d) session token verify/tamper/secret + credential checks");

    // (e) Executive delivery list ------------------------------------------
    const deliveries = await getExecutiveDeliveries(exec2.id);
    const mine = deliveries.find((d) => d.assignmentId === secondRow?.id);
    assert.ok(mine, "Executive must see their open assignment");
    assert.strictEqual(mine.orderNumber, orderNumber);
    assert.strictEqual(mine.buyerName, "Executive Test Buyer");
    assert.strictEqual(mine.itemsCount, 3);
    assert.strictEqual(mine.deliveryAddress?.addressLine1, "44 Delivery Lane");
    assert.strictEqual(mine.deliveryAddress?.city, "Pune");
    console.log("✓ (e) delivery list joins order, address and item count");

    // (f) Status flow --------------------------------------------------------
    const assignmentId = secondRow?.id;
    assert.ok(assignmentId, "Second assignment id must exist");

    await assert.rejects(
      () =>
        updateExecutiveAssignmentStatus(exec2.id, assignmentId, "DELIVERED"),
      /Cannot move a ASSIGNED assignment to DELIVERED/,
      "DELIVERED before PICKED_UP must be rejected",
    );
    await assert.rejects(
      () =>
        updateExecutiveAssignmentStatus(exec1.id, assignmentId, "ACCEPTED"),
      /Assignment not found/,
      "An assignment belonging to another executive must not be updatable",
    );

    const accepted = await updateExecutiveAssignmentStatus(
      exec2.id,
      assignmentId,
      "ACCEPTED",
    );
    assert.strictEqual(accepted.status, "ACCEPTED");
    assert.ok(accepted.acceptedAt, "acceptedAt must be set");
    const [shipmentAfterAccept] = await db
      .select({ status: shipmentOrders.status })
      .from(shipmentOrders)
      .where(eq(shipmentOrders.id, shipment.id));
    assert.strictEqual(
      shipmentAfterAccept?.status,
      "PENDING",
      "ACCEPTED must not move the shipment",
    );

    const pickedUp = await updateExecutiveAssignmentStatus(
      exec2.id,
      assignmentId,
      "PICKED_UP",
    );
    assert.ok(pickedUp.pickedUpAt, "pickedUpAt must be set");
    const [shipmentAfterPickup] = await db
      .select({ status: shipmentOrders.status })
      .from(shipmentOrders)
      .where(eq(shipmentOrders.id, shipment.id));
    assert.strictEqual(shipmentAfterPickup?.status, "OUT_FOR_DELIVERY");
    const [orderAfterPickup] = await db
      .select({ status: orders.status })
      .from(orders)
      .where(eq(orders.id, orderAId));
    assert.strictEqual(orderAfterPickup?.status, "OUT_FOR_DELIVERY");

    const delivered = await updateExecutiveAssignmentStatus(
      exec2.id,
      assignmentId,
      "DELIVERED",
    );
    assert.ok(delivered.deliveredAt, "deliveredAt must be set");
    const [shipmentAfterDelivery] = await db
      .select({ status: shipmentOrders.status })
      .from(shipmentOrders)
      .where(eq(shipmentOrders.id, shipment.id));
    assert.strictEqual(shipmentAfterDelivery?.status, "DELIVERED");
    const [orderAfterDelivery] = await db
      .select({ status: orders.status })
      .from(orders)
      .where(eq(orders.id, orderAId));
    assert.strictEqual(orderAfterDelivery?.status, "DELIVERED");

    const events = await db
      .select()
      .from(shipmentTrackingEvents)
      .where(eq(shipmentTrackingEvents.shipmentId, shipment.id));
    const eventCodes = events.map((e) => e.eventCode);
    assert.ok(eventCodes.includes("OUT_FOR_DELIVERY"));
    assert.ok(eventCodes.includes("DELIVERED"));

    await assert.rejects(
      () =>
        updateExecutiveAssignmentStatus(exec2.id, assignmentId, "FAILED"),
      /already closed/,
      "A DELIVERED assignment accepts no further reports",
    );
    console.log("✓ (f) ACCEPTED -> PICKED_UP -> DELIVERED syncs assignment, shipment, order, tracking");

    // (g) FAILED flow --------------------------------------------------------
    const shipmentB = await createShipmentOrder(sellerAId, {
      orderId: orderBId,
      shippingPartnerId: inhouse.id,
      shippingCost: 0,
      codAmount: 500,
    });
    shipmentIdsForCleanup.push(shipmentB.id);
    const failAssign = await assignDeliveryExecutiveRepo(
      shipmentB.id,
      sellerAId,
      exec1.id,
    );
    assert.ok(failAssign.assignment, "Assignment for order B must exist");
    await updateExecutiveAssignmentStatus(
      exec1.id,
      failAssign.assignment.id,
      "ACCEPTED",
    );
    const failed = await updateExecutiveAssignmentStatus(
      exec1.id,
      failAssign.assignment.id,
      "FAILED",
      "Customer not home",
    );
    assert.strictEqual(failed.status, "FAILED");
    assert.strictEqual(failed.failureReason, "Customer not home");
    const [shipmentBAfter] = await db
      .select({ status: shipmentOrders.status })
      .from(shipmentOrders)
      .where(eq(shipmentOrders.id, shipmentB.id));
    assert.strictEqual(shipmentBAfter?.status, "DELIVERY_FAILED");
    console.log("✓ (g) FAILED records the reason and fails the shipment");

    // (h) Roster update / password reset / soft delete -----------------------
    const roster = await listExecutives({ status: "ACTIVE" });
    const rosterIds = roster.map((e) => e.id);
    assert.ok(rosterIds.includes(exec1.id));
    assert.ok(rosterIds.includes(exec2.id));
    assert.ok(!rosterIds.includes(suspended.id));

    await updateExecutive(exec1.id, { password: "exec-new-pass-1" });
    const relogged = await verifyExecutiveCredentials(
      exec1.phone,
      "exec-new-pass-1",
    );
    assert.strictEqual(relogged.id, exec1.id);

    await softDeleteExecutive(noPassword.id);
    assert.strictEqual(await getExecutiveById(noPassword.id), null);
    const rosterAfterDelete = await listExecutives();
    assert.ok(
      !rosterAfterDelete.some((e) => e.id === noPassword.id),
      "Soft-deleted executives must leave the roster",
    );
    const [deletedRow] = await db
      .select()
      .from(deliveryExecutives)
      .where(eq(deliveryExecutives.id, noPassword.id));
    assert.ok(deletedRow?.deletedAt, "Soft delete must stamp deletedAt");
    assert.strictEqual(deletedRow?.status, "INACTIVE");
    console.log("✓ (h) roster filters, password reset re-hashes, soft delete hides the row");

    console.log("=== ALL EXECUTIVE ASSIGNMENT CHECKS PASSED ===");
  } finally {
    await cleanup();
    console.log("✓ Fixtures cleaned up");
  }
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error("Executive assignment test failed:", err);
    process.exit(1);
  });
