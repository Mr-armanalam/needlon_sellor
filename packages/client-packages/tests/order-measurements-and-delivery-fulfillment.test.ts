import "dotenv/config";
import assert from "node:assert";
import { db } from "@needlon/db";
import { usersTable } from "@needlon/db/db/schema/users";
import { orders } from "@needlon/db/db/schema/orders/table";
import { orderItems } from "@needlon/db/db/schema/orders/order-items/table";
import { orderAddresses } from "@needlon/db/db/schema/orders/order-address";
import { customerMeasurementsTable } from "@needlon/db/db/schema/customization/measurements";
import { shipmentOrders } from "@needlon/db/db/schema/delivery/shipping-orders";
import { seller } from "@needlon/db/db/schema/seller";
import { findOrderById } from "../../modules/modules/orders/repositery/find-order-by-id.repository";
import { toOrderDomain } from "../../modules/modules/orders/mapper/order-domain-mapper";
import { toOrderDetailResponse } from "../../modules/modules/orders/mapper/order-dto-mapper";
import {
  getSellerShipments,
  assignDeliveryExecutiveRepo,
  addOrderDeliveryAddressRepo,
} from "../../modules/modules/delivery/repository/delivery.repository";
import { createExecutive } from "../../modules/modules/delivery/repository/executive.repository";
import { shippingPartners } from "@needlon/db/db/schema/delivery/shipping-partners";
import { shippingMethods } from "@needlon/db/db/schema/delivery/shipping-method";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

async function runTest() {
  console.log("=== STARTING ORDER MEASUREMENTS & DELIVERY FULFILLMENT TEST ===");

  const [testSeller] = await db.select().from(seller).limit(1);
  assert.ok(testSeller, "Must have an existing seller in database");
  const sellerId = testSeller.id;

  // 1. Verify existing order 42c36e79-7fb0-4cd9-9fea-6802f67eb7d9 returns measurement values
  console.log("--> Testing measurement value extraction on order 42c36e79-7fb0-4cd9-9fea-6802f67eb7d9...");
  const orderRes = await findOrderById({
    orderId: "42c36e79-7fb0-4cd9-9fea-6802f67eb7d9",
    sellerId: "f836594d-fe63-4196-8782-6bb9cd04f615",
  });

  assert.ok(orderRes.measurement, "Order measurement must be found in database query");
  assert.strictEqual(orderRes.measurement.garmentType, "lehenga");
  assert.strictEqual(orderRes.measurement.measurementUnit, "INCHES");

  const domain = toOrderDomain(
    orderRes.order,
    orderRes.items,
    orderRes.addresses,
    orderRes.history,
    orderRes.payments,
    orderRes.measurement,
    orderRes.shipment
  );
  assert.ok(domain.measurement, "Domain order must preserve measurement");

  const dto = toOrderDetailResponse(domain);
  assert.ok(dto.measurement, "DTO response must include measurement");
  assert.ok(dto.measurement.essentialMeasurements, "DTO must contain essential measurements");
  assert.strictEqual(dto.measurement.essentialMeasurements.full_hip_circumference, "12");
  assert.strictEqual(dto.measurement.essentialMeasurements.high_hip_circumference, "23");
  assert.strictEqual(dto.measurement.essentialMeasurements.waist_wear_point_circumference, "34");
  console.log("✓ Measurement values verified successfully in DTO!");

  // 2. Create a test in-store order without initial delivery address
  console.log("--> Testing shop-visited order with doorstep delivery address addition...");
  const testBuyerId = randomUUID();
  await db.insert(usersTable).values({
    id: testBuyerId,
    name: "Walk-in Customer",
    email: `walkin-${Date.now()}@example.com`,
  });

  const testOrderId = randomUUID();
  const testOrderNum = `ORD-TEST-${Date.now().toString().slice(-6)}`;
  await db.insert(orders).values({
    id: testOrderId,
    sellerId,
    buyerId: testBuyerId,
    storeId: "f903cf25-51ec-4a58-949b-515710f0f086",
    shippingAddressId: "7b82edbb-487a-4b87-9673-59400e1f5350",
    orderNumber: testOrderNum,
    status: "PENDING",
    paymentStatus: "PAID",
    paymentMethod: "COD",
    shippingMethod: "STORE_PICKUP",
    currency: "INR",
    buyerName: "Walk-in Customer",
    buyerEmail: `walkin-${Date.now()}@example.com`,
    buyerPhone: "9876500000",
    subtotal: "1500.00",
    grandTotal: "1500.00",
  });



  // Check order before address addition
  const preAddressRes = await findOrderById({ orderId: testOrderId, sellerId });
  assert.strictEqual(preAddressRes.addresses.length, 0, "Initial in-store order has no delivery address");

  // Add doorstep delivery address
  const newAddress = await addOrderDeliveryAddressRepo(sellerId, testOrderId, {
    recipientName: "Walk-in Customer Doorstep",
    phoneNumber: "9876500000",
    addressLine1: "Tower B, Flat 701, Green Meadows",
    addressLine2: "Baner Road",
    landmark: "Near Symbiosis",
    city: "Pune",
    state: "Maharashtra",
    postalCode: "411045",
    country: "India",
    deliveryNotes: "Deliver evening after 6pm",
  });

  assert.ok(newAddress.id, "New address must be inserted with UUID");

  // Verify order updated to STANDARD (doorstep delivery) and address inserted in orderAddresses
  const [updatedOrder] = await db.select().from(orders).where(eq(orders.id, testOrderId));
  assert.strictEqual(updatedOrder.shippingMethod, "STANDARD");
  const postAddrQuery = await findOrderById({ orderId: testOrderId, sellerId });
  assert.strictEqual(postAddrQuery.addresses.length, 1);
  assert.strictEqual(postAddrQuery.addresses[0].id, newAddress.id);
  console.log("✓ Doorstep delivery address added and order switched to STANDARD!");



  // 3. Test assigning delivery executive to the order.
  // Roster contract (Phase 3): the executive is a real delivery_executives
  // row, a shipment must exist first, and assignment writes a
  // delivery_assignments row — it no longer fabricates a shipment, stuffs
  // JSON into notes, or advances the order status by itself.
  console.log("--> Testing Delivery Executive Assignment implementation...");
  const executive = await createExecutive(
    {
      name: "Vikram Delivery Hero",
      phone: "9812345678",
      vehicleType: "Electric Scooter",
    },
    sellerId,
  );

  const [fixturePartner] = await db.select().from(shippingPartners).limit(1);
  const [fixtureMethod] = await db
    .select()
    .from(shippingMethods)
    .where(eq(shippingMethods.partnerId, fixturePartner.id))
    .limit(1);
  const [fixtureShipment] = await db
    .insert(shipmentOrders)
    .values({
      shipmentNumber: `SHP-FIXTURE-${Date.now().toString().slice(-6)}`,
      orderId: testOrderId,
      sellerId,
      buyerId: updatedOrder.buyerId,
      shippingPartnerId: fixturePartner.id,
      shippingMethodId: fixtureMethod.id,
      status: "READY_TO_SHIP",
    })
    .returning();

  const assignResult = await assignDeliveryExecutiveRepo(
    fixtureShipment.id,
    sellerId,
    executive.id,
  );

  assert.ok(assignResult.shipment, "Assignment must return the shipment");
  assert.strictEqual(assignResult.shipment.executiveId, executive.id);
  assert.strictEqual(assignResult.assignment.executiveId, executive.id);
  assert.strictEqual(assignResult.assignment.status, "ASSIGNED");

  // Verify findOrderById retrieves shipment and executive details
  const postAssignRes = await findOrderById({ orderId: testOrderId, sellerId });
  assert.ok(postAssignRes.shipment, "findOrderById must return shipment data");
  assert.ok(postAssignRes.shipment.executive, "findOrderById must return executive details");
  assert.strictEqual(postAssignRes.shipment.executive.executiveName, "Vikram Delivery Hero");
  assert.strictEqual(postAssignRes.shipment.executive.executivePhone, "9812345678");
  console.log("✓ Delivery Executive assigned and verified on order inspector query!");

  // 4. Test Delivery Page connecting to real orders and seller
  console.log("--> Testing Delivery Page connection to seller dispatches...");
  const sellerShipments = await getSellerShipments(sellerId);
  assert.ok(Array.isArray(sellerShipments), "Shipments must be returned as array");
  assert.ok(sellerShipments.length > 0, "Seller shipments must include seller's real orders");

  const testOrderShipment = sellerShipments.find((s) => s.rawOrderId === testOrderId || s.orderId === testOrderNum);
  assert.ok(testOrderShipment, "Created test order must appear in seller's dispatches list");
  assert.strictEqual(testOrderShipment.status, "OUT_FOR_DELIVERY");
  assert.ok(testOrderShipment.executive, "Shipment on delivery page must have executive attached");
  assert.strictEqual(testOrderShipment.executive.executiveName, "Vikram Delivery Hero");
  console.log("✓ Delivery page successfully connected to seller's real orders and active dispatches!");

  // Clean up test order
  await db.delete(shipmentOrders).where(eq(shipmentOrders.orderId, testOrderId));
  await db.delete(orderAddresses).where(eq(orderAddresses.orderId, testOrderId));
  await db.delete(orders).where(eq(orders.id, testOrderId));
  await db.delete(usersTable).where(eq(usersTable.id, testBuyerId));

  console.log("=== ALL ORDER MEASUREMENTS & DELIVERY FULFILLMENT TESTS PASSED! ===");
}

runTest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Test failed with error:", err);
    process.exit(1);
  });
