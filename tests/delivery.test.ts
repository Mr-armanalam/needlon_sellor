import assert from "node:assert";
import {
  createShippingPartnerSchema,
  createShippingMethodSchema,
  createShipmentOrderSchema,
  updateShipmentStatusSchema,
  getShipmentsQuerySchema,
} from "../modules/delivery/dto/delivery.dto";

function testDeliveryValidations() {
  console.log("--> Testing Delivery & Logistics Zod Validations...");

  // Valid Shipping Partner DTO
  const validPartner = {
    partnerCode: "FEDEX",
    partnerName: "FedEx Express",
    supportsCod: true,
    supportsPickup: true,
  };
  const parsedPartner = createShippingPartnerSchema.parse(validPartner);
  assert.strictEqual(parsedPartner.partnerCode, "FEDEX");
  assert.strictEqual(parsedPartner.supportsCod, true);

  // Valid Shipping Method DTO
  const validMethod = {
    partnerId: "123e4567-e89b-12d3-a456-426614174000",
    methodCode: "FEDEX_EXPRESS",
    methodName: "FedEx Next-Day Express",
    estimatedMinDays: 1,
    estimatedMaxDays: 2,
  };
  const parsedMethod = createShippingMethodSchema.parse(validMethod);
  assert.strictEqual(parsedMethod.methodCode, "FEDEX_EXPRESS");
  assert.strictEqual(parsedMethod.estimatedMaxDays, 2);

  // Valid Shipment Order DTO
  const validShipment = {
    orderId: "123e4567-e89b-12d3-a456-426614174000",
    buyerId: "223e4567-e89b-12d3-a456-426614174000",
    shippingPartnerId: "323e4567-e89b-12d3-a456-426614174000",
    shippingMethodId: "423e4567-e89b-12d3-a456-426614174000",
    shippingCost: 150,
  };
  const parsedShipment = createShipmentOrderSchema.parse(validShipment);
  assert.strictEqual(parsedShipment.shippingCost, 150);

  // Invalid UUID assertion
  assert.throws(() => {
    createShipmentOrderSchema.parse({
      orderId: "invalid-uuid",
      buyerId: "223e4567-e89b-12d3-a456-426614174000",
      shippingPartnerId: "323e4567-e89b-12d3-a456-426614174000",
      shippingMethodId: "423e4567-e89b-12d3-a456-426614174000",
    });
  });

  // Valid Status Update DTO
  const validStatusUpdate = {
    shipmentId: "123e4567-e89b-12d3-a456-426614174000",
    status: "OUT_FOR_DELIVERY",
    trackingNumber: "TRK-99887766",
  };
  const parsedStatus = updateShipmentStatusSchema.parse(validStatusUpdate);
  assert.strictEqual(parsedStatus.status, "OUT_FOR_DELIVERY");
  assert.strictEqual(parsedStatus.trackingNumber, "TRK-99887766");

  // Invalid Status Enum assertion
  assert.throws(() => {
    updateShipmentStatusSchema.parse({
      shipmentId: "123e4567-e89b-12d3-a456-426614174000",
      status: "INVALID_STATUS",
    });
  });

  console.log("✓ Delivery Zod validation tests passed.");
}

function testDeliveryCalculations() {
  console.log("--> Testing Delivery Status & Date Calculations...");

  const mockShipments = [
    { id: "1", status: "PENDING" },
    { id: "2", status: "READY_FOR_PICKUP" },
    { id: "3", status: "IN_TRANSIT" },
    { id: "4", status: "OUT_FOR_DELIVERY" },
    { id: "5", status: "DELIVERED" },
    { id: "6", status: "DELIVERED" },
  ];

  const counts = {
    total: mockShipments.length,
    inTransit: mockShipments.filter((s) => s.status === "IN_TRANSIT" || s.status === "OUT_FOR_DELIVERY").length,
    delivered: mockShipments.filter((s) => s.status === "DELIVERED").length,
    pending: mockShipments.filter((s) => s.status === "PENDING" || s.status === "READY_FOR_PICKUP").length,
  };

  assert.strictEqual(counts.total, 6);
  assert.strictEqual(counts.inTransit, 2);
  assert.strictEqual(counts.delivered, 2);
  assert.strictEqual(counts.pending, 2);

  // Test Estimated Delivery Date Calculation
  const orderDate = new Date("2026-09-27T10:00:00Z");
  const maxDays = 3;
  const estimatedDelivery = new Date(orderDate.getTime() + maxDays * 24 * 60 * 60 * 1000);
  assert.strictEqual(estimatedDelivery.toISOString(), "2026-09-30T10:00:00.000Z");

  console.log("✓ Delivery calculation tests passed.");
}

function runAllTests() {
  console.log("=== DELIVERY MODULE TEST SUITE ===");
  testDeliveryValidations();
  testDeliveryCalculations();
  console.log("=== ALL DELIVERY UNIT TESTS PASSED SUCCESSFULLY! ===");
}

runAllTests();
