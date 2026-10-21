/**
 * End-to-end flow validation (integration test, requires DATABASE_URL):
 *
 *   catalog product + variant + pricing + inventory
 *     -> storefront checkout order (inventory decrement verified)
 *     -> shop-visit measurement + in-store bespoke order (measurement linked)
 *     -> delivery address added for the shop-visit order
 *     -> shipment created with a delivery partner
 *     -> delivery executive assigned
 *     -> shipment status advanced to DELIVERED
 *
 * Run: DATABASE_URL=... npx tsx tests/flow-inventory-order-delivery.test.ts
 */
import "dotenv/config";
import assert from "node:assert";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

import { db } from "@needlon/db";
import { usersTable } from "@needlon/db/db/schema/users";
import { seller } from "@needlon/db/db/schema/seller";
import { sellerStore } from "@needlon/db/db/schema/seller/seller-store";
import { categoriesTable } from "@needlon/db/db/schema/catalog/categories/table";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { productVariantsTable } from "@needlon/db/db/schema/catalog/products/product-variants/table";
import { pricingTable } from "@needlon/db/db/schema/catalog/products/pricing/table";
import { inventoryTable } from "@needlon/db/db/schema/catalog/products/inventory/table";
import { orders } from "@needlon/db/db/schema/orders/table";
import { customerMeasurementsTable } from "@needlon/db/db/schema/customization/measurements";
import { shippingPartners } from "@needlon/db/db/schema/delivery/shipping-partners";
import { shippingMethods } from "@needlon/db/db/schema/delivery/shipping-method";
import { shipmentOrders } from "@needlon/db/db/schema/delivery/shipping-orders";

import { OrderCreationService } from "../client-modules/orders/services/order-creation-service";
import {
  createInStoreMeasurementRepo,
  createInStoreOrderRepo,
} from "../../modules/modules/customers/repository/customer.repository";
import {
  addOrderDeliveryAddressRepo,
  assignDeliveryExecutiveRepo,
  createShipmentOrder,
  getSellerShipments,
  updateShipmentStatus,
} from "../../modules/modules/delivery/repository/delivery.repository";

async function runFlowTest() {
  console.log("=== FLOW: inventory -> order -> measurement -> delivery ===");
  const stamp = Date.now().toString().slice(-6);

  // Fixtures: seller, store, buyer
  const sellerId = randomUUID();
  const storeId = randomUUID();
  const buyerId = randomUUID();
  await db.insert(seller).values({
    id: sellerId,
    name: "Flow Test Tailor",
    email: `flow-seller-${stamp}@example.com`,
    passwordHash: "test-hash",
  });
  await db.insert(sellerStore).values({
    id: storeId,
    sellerId,
    storeName: "Flow Test Store",
    storeSlug: `flow-store-${stamp}`,
  });
  await db.insert(usersTable).values({
    id: buyerId,
    name: "Flow Test Buyer",
    email: `flow-buyer-${stamp}@example.com`,
    number: "+91 9000000000",
  });
  console.log("✓ Fixtures: seller, store, buyer created");

  // 1. Catalog: category, product, variant, pricing, inventory
  const categoryId = randomUUID();
  await db.insert(categoriesTable).values({
    id: categoryId,
    name: "Flow Category",
    slug: `flow-cat-${stamp}`,
    code: `FLOW-${stamp}`,
    path: `/flow-cat-${stamp}`,
  });
  const productId = randomUUID();
  await db.insert(productsTable).values({
    id: productId,
    // products.seller_id references seller_store.seller_id, i.e. the seller
    // that owns the store (the store row itself was created above).
    storeId: sellerId,
    categoryId,
    name: "Flow Test Kurta",
    slug: `flow-kurta-${stamp}`,
    status: "PUBLISHED",
    isCustomizable: true,
  });
  const variantId = randomUUID();
  await db.insert(productVariantsTable).values({
    id: variantId,
    productId,
    name: "Size M",
    sku: `FLOW-SKU-${stamp}`,
    status: "ACTIVE",
  });
  await db.insert(pricingTable).values({
    id: randomUUID(),
    variantId,
    price: "1499.00",
    currencyCode: "INR",
  });
  await db.insert(inventoryTable).values({
    id: randomUUID(),
    variantId,
    quantity: 10,
    reservedQuantity: 0,
    lowStockThreshold: 2,
  });
  console.log("✓ Catalog: product + variant + pricing + inventory (qty 10)");

  // 2. Storefront checkout order for 3 units
  const checkout = await OrderCreationService.createOrderFromCheckoutSession({
    sessionId: `flow-session-${stamp}`,
    buyerId,
    shippingAddressSnapshot: {
      recipientName: "Flow Test Buyer",
      phoneNumber: "+91 9000000000",
      addressLine1: "12 MG Road",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411001",
      country: "India",
    },
    cartItems: [{ productId, quantity: 3, price: 1499, name: "Flow Test Kurta" }],
    paymentMethod: "COD",
  });
  assert.ok(checkout && typeof checkout === "object", "Checkout must return a result");
  const [invAfter] = await db
    .select({ quantity: inventoryTable.quantity })
    .from(inventoryTable)
    .where(eq(inventoryTable.variantId, variantId));
  assert.ok(invAfter, "Inventory row must exist");
  console.log(`✓ Storefront order placed; inventory now ${invAfter.quantity} (was 10, ordered 3)`);

  // 3. Shop visit: record measurement, then in-store bespoke order linked to it
  const measurement = await createInStoreMeasurementRepo(sellerId, {
    userId: buyerId,
    gender: "menswear",
    garmentType: "kurta",
    measurementUnit: "INCHES",
    essentialMeasurements: { chest_circumference: 40, waist_circumference: 34 },
    tailorNotes: "Recorded during shop visit",
  });
  assert.ok(measurement?.id, "Measurement must be recorded");
  const bespokeOrder = await createInStoreOrderRepo(sellerId, {
    customerId: buyerId,
    measurementId: measurement.id,
    garmentName: "Bespoke Flow Kurta",
    amount: 5200,
    advancePaid: 2000,
    paymentMethod: "UPI",
    deliveryMethod: "HOME_DELIVERY",
    shippingAddress: {
      recipientName: "Flow Test Buyer",
      phoneNumber: "+91 9000000000",
      addressLine1: "12 MG Road",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411001",
    },
  });
  assert.ok(bespokeOrder?.id, "In-store order must be created");
  const [linkedMeasurement] = await db
    .select({ orderId: customerMeasurementsTable.orderId })
    .from(customerMeasurementsTable)
    .where(eq(customerMeasurementsTable.id, measurement.id));
  assert.strictEqual(
    linkedMeasurement?.orderId,
    bespokeOrder.id,
    "Measurement must be linked to the in-store order"
  );
  const [bespokeRow] = await db
    .select({ paymentStatus: orders.paymentStatus, source: orders.source })
    .from(orders)
    .where(eq(orders.id, bespokeOrder.id));
  console.log(
    `✓ Shop-visit order ${bespokeOrder.orderNumber}: measurement linked, paymentStatus=${bespokeRow?.paymentStatus} (advance 2000 of 5200)`
  );

  // 4. Delivery: address, shipment with partner, executive assignment, delivery
  await addOrderDeliveryAddressRepo(sellerId, bespokeOrder.id, {
    recipientName: "Flow Test Buyer",
    phoneNumber: "+91 9000000000",
    addressLine1: "12 MG Road",
    city: "Pune",
    state: "Maharashtra",
    postalCode: "411001",
    country: "India",
  });
  console.log("✓ Delivery address recorded for the shop-visit order");

  const partnerId = randomUUID();
  await db.insert(shippingPartners).values({
    id: partnerId,
    partnerCode: `FLOW-${stamp}`,
    partnerName: "Flow Express",
    supportsCod: true,
    isActive: true,
  });
  await db.insert(shippingMethods).values({
    id: randomUUID(),
    partnerId,
    methodCode: `STD-${stamp}`,
    methodName: "Standard Delivery",
    isDefault: true,
    isActive: true,
  });
  const shipment = await createShipmentOrder(sellerId, {
    orderId: bespokeOrder.id,
    buyerId,
    shippingPartnerId: partnerId,
    shippingCost: 0,
    codAmount: 0,
  });
  assert.ok(shipment?.id, "Shipment must be created");
  const [shipmentRow] = await db
    .select({
      partnerId: shipmentOrders.shippingPartnerId,
      orderId: shipmentOrders.orderId,
      sellerId: shipmentOrders.sellerId,
      buyerId: shipmentOrders.buyerId,
    })
    .from(shipmentOrders)
    .where(eq(shipmentOrders.id, shipment.id));
  assert.strictEqual(shipmentRow?.partnerId, partnerId, "Shipment must reference the delivery partner");
  assert.strictEqual(shipmentRow?.orderId, bespokeOrder.id, "Shipment must reference the order");
  assert.strictEqual(shipmentRow?.buyerId, buyerId, "Shipment must reference the customer");
  console.log("✓ Shipment created with delivery partner, order, seller and customer relations");

  await assignDeliveryExecutiveRepo(sellerId, bespokeOrder.id, {
    executiveName: "Ravi Kumar",
    executivePhone: "+91 9888888888",
    vehicleType: "Bike / Two Wheeler",
    courierPartner: "Flow Express",
    trackingNumber: `TRK-${stamp}`,
    status: "OUT_FOR_DELIVERY",
  });
  const shipments = await getSellerShipments(sellerId);
  // getSellerShipments exposes the order number as `orderId` and the order
  // UUID as `rawOrderId`.
  const mine = shipments.find((s) => s.rawOrderId === bespokeOrder.id);
  assert.ok(mine, "Seller shipments must include the assigned shipment");
  console.log(`✓ Delivery executive assigned; shipment status=${mine.status}`);

  await updateShipmentStatus({ shipmentId: shipment.id, status: "DELIVERED" });
  const [finalShipment] = await db
    .select({ status: shipmentOrders.status })
    .from(shipmentOrders)
    .where(eq(shipmentOrders.id, shipment.id));
  assert.strictEqual(finalShipment?.status, "DELIVERED", "Shipment must reach DELIVERED");
  console.log("✓ Shipment advanced to DELIVERED");

  console.log("=== ALL FLOW STEPS PASSED ===");
  process.exit(0);
}

runFlowTest().catch((err: unknown) => {
  console.error("Flow test failed:", err);
  process.exit(1);
});
