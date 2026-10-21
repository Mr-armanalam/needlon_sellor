/**
 * Label + tracking unification validation (integration test, requires a
 * running Postgres):
 *
 *   checkout order -> shipment created via the delivery repository (INHOUSE)
 *     -> buildShippingLabelData takes courier + tracking identity from the
 *        shipment (never a synthesized AWB-<orderNumber>)
 *     -> first label build advances the shipment to LABEL_GENERATED and
 *        records a LABEL_GENERATED shipment_tracking_events row
 *     -> an order with NO shipment cannot produce a label
 *     -> the buyer order detail/timeline (client-packages) reads the same
 *        shipment_orders + tracking events and shows the real AWB
 *
 * Run: DATABASE_URL=... npx tsx tests/label-tracking-unification.test.ts
 */
import assert from "node:assert";
import { randomUUID } from "node:crypto";

// Must be set before @needlon/db is imported (it reads DATABASE_URL at
// module load), so every DB-touching import below is dynamic.
process.env.DATABASE_URL ??=
  "postgres://needlon:needlon@localhost:5432/needlon_test";

async function runLabelTrackingTest() {
  console.log("=== LABEL/TRACKING: shipment is the single source of truth ===");
  const stamp = Date.now().toString().slice(-6);

  const { db } = await import("@needlon/db");
  const { eq } = await import("drizzle-orm");
  const { usersTable } = await import("@needlon/db/db/schema/users");
  const { seller } = await import("@needlon/db/db/schema/seller");
  const { sellerStore } = await import(
    "@needlon/db/db/schema/seller/seller-store"
  );
  const { sellerAddresses } = await import(
    "@needlon/db/db/schema/seller/seller-address"
  );
  const { categoriesTable } = await import(
    "@needlon/db/db/schema/catalog/categories/table"
  );
  const { productsTable } = await import(
    "@needlon/db/db/schema/catalog/products/table"
  );
  const { productVariantsTable } = await import(
    "@needlon/db/db/schema/catalog/products/product-variants/table"
  );
  const { pricingTable } = await import(
    "@needlon/db/db/schema/catalog/products/pricing/table"
  );
  const { inventoryTable } = await import(
    "@needlon/db/db/schema/catalog/products/inventory/table"
  );
  const { orders } = await import("@needlon/db/db/schema/orders/table");
  const { shippingPartners } = await import(
    "@needlon/db/db/schema/delivery/shipping-partners"
  );
  const { shipmentOrders } = await import(
    "@needlon/db/db/schema/delivery/shipping-orders"
  );
  const { shipmentTrackingEvents } = await import(
    "@needlon/db/db/schema/delivery/shipping-tracking-events"
  );
  const { OrderCreationService } = await import(
    "../client-modules/orders/services/order-creation-service"
  );
  const { OrderRepository } = await import(
    "../client-modules/orders/repositories/order-repository"
  );
  const { createShipmentOrder, getShippingPartners } = await import(
    "../../modules/modules/delivery/repository/delivery.repository"
  );
  const { buildShippingLabelData, ShippingLabelError } = await import(
    "../../modules/modules/orders/documents/services/shipping-label.service"
  );

  // Fixtures: seller, store, buyer
  const sellerId = randomUUID();
  const buyerId = randomUUID();
  await db.insert(seller).values({
    id: sellerId,
    name: "Label Test Tailor",
    email: `label-seller-${stamp}@example.com`,
    passwordHash: "test-hash",
  });
  await db.insert(sellerStore).values({
    id: randomUUID(),
    sellerId,
    storeName: "Label Test Store",
    storeSlug: `label-store-${stamp}`,
  });
  // Checkout requires the seller to have a real dispatch address on file.
  await db.insert(sellerAddresses).values({
    id: randomUUID(),
    sellerId,
    label: "Main Warehouse",
    addressType: "WAREHOUSE",
    addressLine1: "2 Label Street",
    city: "Pune",
    district: "Pune",
    state: "Maharashtra",
    postalCode: "411001",
  });
  await db.insert(usersTable).values({
    id: buyerId,
    name: "Label Test Buyer",
    email: `label-buyer-${stamp}@example.com`,
    number: "+91 9000000001",
  });
  console.log("✓ Fixtures: seller, store, buyer created");

  // Catalog: category, product, variant, pricing, inventory
  const categoryId = randomUUID();
  await db.insert(categoriesTable).values({
    id: categoryId,
    name: "Label Category",
    slug: `label-cat-${stamp}`,
    code: `LBL-${stamp}`,
    path: `/label-cat-${stamp}`,
  });
  const productId = randomUUID();
  await db.insert(productsTable).values({
    id: productId,
    storeId: sellerId,
    categoryId,
    name: "Label Test Shirt",
    slug: `label-shirt-${stamp}`,
    status: "PUBLISHED",
    isCustomizable: false,
  });
  const variantId = randomUUID();
  await db.insert(productVariantsTable).values({
    id: variantId,
    productId,
    name: "Size L",
    sku: `LBL-SKU-${stamp}`,
    status: "ACTIVE",
  });
  await db.insert(pricingTable).values({
    id: randomUUID(),
    variantId,
    price: "999.00",
    currencyCode: "INR",
  });
  await db.insert(inventoryTable).values({
    id: randomUUID(),
    variantId,
    quantity: 10,
    reservedQuantity: 0,
    lowStockThreshold: 2,
  });
  console.log("✓ Catalog fixtures created");

  const placeOrder = async (sessionSuffix: string) => {
    const checkout = await OrderCreationService.createOrderFromCheckoutSession({
      sessionId: `label-session-${stamp}-${sessionSuffix}`,
      buyerId,
      shippingAddressSnapshot: {
        recipientName: "Label Test Buyer",
        phoneNumber: "+91 9000000001",
        addressLine1: "44 FC Road",
        city: "Pune",
        state: "Maharashtra",
        postalCode: "411005",
        country: "India",
      },
      cartItems: [
        { productId, quantity: 1, price: 999, name: "Label Test Shirt" },
      ],
      paymentMethod: "COD",
    });
    assert.ok(checkout && typeof checkout === "object", "Checkout must return a result");
    return checkout;
  };

  // Order WITH a shipment (INHOUSE partner, seeded)
  const orderWithShipment = await placeOrder("a");
  const orderId = orderWithShipment.orderId;
  assert.ok(orderId, "Checkout order must expose its order id");

  const partners = await getShippingPartners();
  const inhouse = partners.find((p) => p.partnerCode === "INHOUSE");
  assert.ok(inhouse, "Seeded INHOUSE partner must exist");
  assert.strictEqual(inhouse.partnerName, "In-House Local Fleet");

  // NOTE: OrderCreationService assigns the checkout order to the first
  // seller row in the DB (its step-3 resolution ignores the product's
  // seller), so read the order's actual seller and ship as that seller —
  // createShipmentOrder now enforces order ownership.
  const [orderRow] = await db
    .select({ sellerId: orders.sellerId })
    .from(orders)
    .where(eq(orders.id, orderId));
  assert.ok(orderRow?.sellerId, "Checkout order must carry a seller");
  const orderSellerId = orderRow.sellerId;

  const shipment = await createShipmentOrder(orderSellerId, {
    orderId,
    buyerId,
    shippingPartnerId: inhouse.id,
    shippingCost: 0,
    codAmount: 999,
  });
  assert.ok(shipment?.id, "Shipment must be created");
  assert.ok(shipment.awbNumber, "Shipment must carry an AWB number");
  console.log(`✓ Shipment created (${shipment.shipmentNumber}, AWB ${shipment.awbNumber})`);

  // 1. Label data comes from the shipment, not from the order number
  const labelData = await buildShippingLabelData(orderId);
  assert.strictEqual(
    labelData.courierName,
    "In-House Local Fleet",
    "Label courier must be the shipment's partner name"
  );
  assert.strictEqual(
    labelData.trackingNumber,
    shipment.awbNumber,
    "Label tracking number must be the shipment's real AWB"
  );
  console.log("✓ Label uses the shipment's partner name and AWB");

  // 2. First label build advances the shipment + writes the tracking event
  const [shipmentAfter] = await db
    .select({
      status: shipmentOrders.status,
      labelGeneratedAt: shipmentOrders.labelGeneratedAt,
    })
    .from(shipmentOrders)
    .where(eq(shipmentOrders.id, shipment.id));
  assert.strictEqual(
    shipmentAfter?.status,
    "LABEL_GENERATED",
    "Shipment must advance to LABEL_GENERATED after the first label build"
  );
  assert.ok(
    shipmentAfter?.labelGeneratedAt,
    "labelGeneratedAt must be stamped after the first label build"
  );

  const events = await db
    .select()
    .from(shipmentTrackingEvents)
    .where(eq(shipmentTrackingEvents.shipmentId, shipment.id));
  const labelEvent = events.find((e) => e.eventCode === "LABEL_GENERATED");
  assert.ok(labelEvent, "A LABEL_GENERATED tracking event must exist");
  assert.strictEqual(labelEvent.trackingStatus, "SHIPMENT_CREATED");
  assert.strictEqual(labelEvent.eventDescription, "Shipping label generated");
  console.log("✓ Shipment advanced to LABEL_GENERATED with tracking event recorded");

  // 3. A second label build must not duplicate the transition/event
  await buildShippingLabelData(orderId);
  const eventsAfterSecond = await db
    .select()
    .from(shipmentTrackingEvents)
    .where(eq(shipmentTrackingEvents.shipmentId, shipment.id));
  assert.strictEqual(
    eventsAfterSecond.filter((e) => e.eventCode === "LABEL_GENERATED").length,
    1,
    "Repeat label builds must not duplicate the LABEL_GENERATED event"
  );
  console.log("✓ Repeat label build is transition-idempotent");

  // 4. An order with NO shipment cannot produce a label
  const orderWithoutShipment = await placeOrder("b");
  let noShipmentError: unknown = null;
  try {
    await buildShippingLabelData(orderWithoutShipment.orderId);
  } catch (err: unknown) {
    noShipmentError = err;
  }
  assert.ok(
    noShipmentError instanceof ShippingLabelError,
    "Label build for a shipment-less order must throw ShippingLabelError"
  );
  assert.strictEqual(noShipmentError.code, "NO_SHIPMENT");
  console.log("✓ Shipment-less order correctly refuses label generation");

  // 5. Buyer side: order detail/timeline reads the same shipment + events
  const detail = await OrderRepository.getOrderDetail(orderId, buyerId);
  assert.ok(detail && detail.length > 0, "Buyer order detail must resolve");
  const first = detail[0];
  assert.strictEqual(
    first.shipments[0]?.partnerName,
    "In-House Local Fleet",
    "Buyer detail must expose the real shipment partner"
  );
  assert.strictEqual(
    first.shipments[0]?.shipment.awbNumber,
    shipment.awbNumber,
    "Buyer detail must expose the real AWB"
  );
  const timelineJson = JSON.stringify(first.timeline);
  assert.ok(
    timelineJson.includes(shipment.awbNumber),
    "Buyer timeline must include the AWB string"
  );
  assert.ok(
    first.timeline.some((step) => step.title === "Shipping label generated"),
    "Buyer timeline must include the LABEL_GENERATED tracking event"
  );
  console.log("✓ Buyer timeline shows the real partner, AWB and tracking events");

  console.log("=== ALL LABEL/TRACKING STEPS PASSED ===");
  process.exit(0);
}

runLabelTrackingTest().catch((err: unknown) => {
  console.error("Label/tracking test failed:", err);
  process.exit(1);
});
