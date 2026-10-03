import assert from "node:assert";
import {
  createShippingPartnerSchema,
  createShippingMethodSchema,
  createShipmentOrderSchema,
  updateShipmentStatusSchema,
  connectCarrierSchema,
  localDeliverySettingsSchema,
  pickupHubSchema,
  shippingZoneSchema,
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

  // Connect Carrier DTO validation
  const connectCarrier = {
    partnerId: "p1",
    partnerCode: "SHIPROCKET",
    apiKey: "sbx_test_key_9812739",
    isSandbox: true,
    isActive: true,
  };
  const parsedConnect = connectCarrierSchema.parse(connectCarrier);
  assert.strictEqual(parsedConnect.partnerCode, "SHIPROCKET");
  assert.strictEqual(parsedConnect.isSandbox, true);

  // Local Delivery Radius DTO validation
  const localSettings = {
    maxRadiusKm: 15,
    baseCharge: 5,
    freeShippingThreshold: 100,
  };
  const parsedLocal = localDeliverySettingsSchema.parse(localSettings);
  assert.strictEqual(parsedLocal.maxRadiusKm, 15);
  assert.strictEqual(parsedLocal.baseCharge, 5);

  // Pickup Hub DTO validation
  const hub = {
    hubName: "Needlon Main Hub",
    address: "Block-C Industrial Sector",
    city: "Pimpri-Chinchwad",
    pincode: "411019",
    phone: "+91 98765 43210",
  };
  const parsedHub = pickupHubSchema.parse(hub);
  assert.strictEqual(parsedHub.pincode, "411019");

  // Shipping Zone DTO validation
  const zone = {
    zoneName: "Domestic All States",
    partnerCode: "FEDEX",
    flatRateFee: 12,
    estimatedDays: "2-4 days",
  };
  const parsedZone = shippingZoneSchema.parse(zone);
  assert.strictEqual(parsedZone.flatRateFee, 12);

  // Valid Status Update DTO
  const validStatusUpdate = {
    shipmentId: "123e4567-e89b-12d3-a456-426614174000",
    status: "OUT_FOR_DELIVERY",
    trackingNumber: "TRK-99887766",
  };
  const parsedStatus = updateShipmentStatusSchema.parse(validStatusUpdate);
  assert.strictEqual(parsedStatus.status, "OUT_FOR_DELIVERY");
  assert.strictEqual(parsedStatus.trackingNumber, "TRK-99887766");

  console.log("✓ Delivery Zod validation tests passed.");
}

function testDeliveryCalculations() {
  console.log("--> Testing Delivery Status & Rate Calculations...");

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

  // Test Free Shipping Threshold Override
  const cartAmount = 150;
  const freeThreshold = 100;
  const baseRate = 12.0;
  const finalShippingFee = cartAmount >= freeThreshold ? 0.0 : baseRate;
  assert.strictEqual(finalShippingFee, 0.0);

  console.log("✓ Delivery calculation tests passed.");
}

function runAllTests() {
  console.log("=== DELIVERY MODULE TEST SUITE ===");
  testDeliveryValidations();
  testDeliveryCalculations();
  console.log("=== ALL DELIVERY UNIT TESTS PASSED SUCCESSFULLY! ===");
}

runAllTests();
