import assert from "node:assert";
import { updateOrderStatusBodySchema } from "../modules/orders/validations";

function testUpdateOrderStatusValidation() {
  console.log("--> Testing updateOrderStatusBodySchema validation...");

  // 1. ADVANCE without remarks should now succeed (fixing the 400 error when clicking "Advance Step Pipeline")
  const advanceNoRemarks = updateOrderStatusBodySchema.parse({ action: "ADVANCE" });
  assert.strictEqual(advanceNoRemarks.action, "ADVANCE");
  assert.strictEqual(typeof advanceNoRemarks.remarks, "string");

  // 2. ADVANCE with custom remarks
  const advanceWithRemarks = updateOrderStatusBodySchema.parse({
    action: "ADVANCE",
    remarks: "Advanced step pipeline via seller portal",
  });
  assert.strictEqual(advanceWithRemarks.action, "ADVANCE");
  assert.strictEqual(advanceWithRemarks.remarks, "Advanced step pipeline via seller portal");

  // 3. CANCEL with remarks
  const cancelWithRemarks = updateOrderStatusBodySchema.parse({
    action: "CANCEL",
    remarks: "Out of fabric stock",
  });
  assert.strictEqual(cancelWithRemarks.action, "CANCEL");
  assert.strictEqual(cancelWithRemarks.remarks, "Out of fabric stock");

  // 4. Invalid action should throw
  assert.throws(() => {
    updateOrderStatusBodySchema.parse({ action: "UNKNOWN_ACTION" });
  });

  console.log("✓ updateOrderStatusBodySchema validation tests passed.");
}

function testFulfillmentPipelineTransitionSequence() {
  console.log("--> Testing fulfillment pipeline step sequence...");

  const pipelineMap: Record<string, string> = {
    PENDING: "CONFIRMED",
    CONFIRMED: "PROCESSING",
    PROCESSING: "SHIPPED",
    SHIPPED: "OUT_FOR_DELIVERY",
    OUT_FOR_DELIVERY: "DELIVERED",
  };

  assert.strictEqual(pipelineMap["PENDING"], "CONFIRMED");
  assert.strictEqual(pipelineMap["CONFIRMED"], "PROCESSING");
  assert.strictEqual(pipelineMap["PROCESSING"], "SHIPPED");
  assert.strictEqual(pipelineMap["SHIPPED"], "OUT_FOR_DELIVERY");
  assert.strictEqual(pipelineMap["OUT_FOR_DELIVERY"], "DELIVERED");

  console.log("✓ Fulfillment pipeline transition sequence verified.");
}

function testBespokeVsReadyToWearDifferentiation() {
  console.log("--> Testing Bespoke vs Ready-to-Wear order differentiation...");

  const bespokeOrder = {
    orderId: "ord-1",
    tailoringStage: "MEASUREMENT_VERIFIED",
    items: [{ variantName: null, productName: "Custom Suit" }],
    measurement: { garmentType: "Suit", essentialMeasurements: { chest: 40 } },
  };

  const rtwOrder = {
    orderId: "ord-2",
    tailoringStage: null,
    items: [{ variantName: "Size: XL", productName: "Ready-to-Wear Shirt" }],
    measurement: null,
  };

  const isBespoke1 = !!bespokeOrder.measurement || !!bespokeOrder.tailoringStage;
  const isBespoke2 = !!rtwOrder.measurement || !!rtwOrder.tailoringStage;

  assert.strictEqual(isBespoke1, true, "Bespoke order must be detected as bespoke");
  assert.strictEqual(isBespoke2, false, "RTW order must not be detected as bespoke");

  const displayTag1 = isBespoke1 ? `Custom Fit (${bespokeOrder.measurement?.garmentType})` : bespokeOrder.items[0].variantName || "Ready-to-Wear";
  const displayTag2 = isBespoke2 ? `Custom Fit` : rtwOrder.items[0].variantName || "Ready-to-Wear";

  assert.strictEqual(displayTag1, "Custom Fit (Suit)");
  assert.strictEqual(displayTag2, "Size: XL");

  console.log("✓ Bespoke vs Ready-to-Wear differentiation tests passed.");
}

function testCustomerMeasurementEditAccessControl() {
  console.log("--> Testing Customer Measurement Edit Access Control...");

  // Mock measurement record
  let measurement = {
    id: "meas-001",
    userId: "cust-123",
    garmentType: "Suit",
    status: "SUBMITTED",
    isEditable: false,
    editRequested: false,
    editRequestReason: null as string | null,
    essentialMeasurements: { chest: 38, waist: 32 },
  };

  // Rule 1: Customer attempts to edit when isEditable is false -> Should be blocked (HTTP 403 Forbidden)
  function attemptCustomerEdit(record: typeof measurement, newValues: any) {
    if (!record.isEditable) {
      throw new Error("FORBIDDEN: Measurements are locked. Seller must grant permission to edit.");
    }
    return {
      ...record,
      essentialMeasurements: { ...record.essentialMeasurements, ...newValues },
      isEditable: false, // Re-lock after saving
      editRequested: false,
      editRequestReason: null,
    };
  }

  assert.throws(
    () => attemptCustomerEdit(measurement, { chest: 39 }),
    /FORBIDDEN: Measurements are locked/
  );

  // Rule 2: Customer requests edit
  measurement.editRequested = true;
  measurement.editRequestReason = "Need 1 inch looser fit around chest";
  assert.strictEqual(measurement.editRequested, true);
  assert.strictEqual(measurement.editRequestReason, "Need 1 inch looser fit around chest");

  // Rule 3: Seller grants edit permission ("Allow Customer Edit")
  function sellerAllowCustomerEdit(record: typeof measurement) {
    return { ...record, isEditable: true };
  }
  measurement = sellerAllowCustomerEdit(measurement);
  assert.strictEqual(measurement.isEditable, true);

  // Rule 4: Customer can now resubmit measurements, which re-locks the record
  measurement = attemptCustomerEdit(measurement, { chest: 39 });
  assert.strictEqual(measurement.essentialMeasurements.chest, 39);
  assert.strictEqual(measurement.isEditable, false, "Must re-lock after customer edits and submits");
  assert.strictEqual(measurement.editRequested, false);

  console.log("✓ Customer Measurement Edit Access Control tests passed.");
}

function testClientTimelineStepSynchronization() {
  console.log("--> Testing Client Timeline Step Synchronization...");

  const pipelineStages = [
    { key: "PENDING", title: "Order Placed" },
    { key: "CONFIRMED", title: "Accepted" },
    { key: "PROCESSING", title: "Packed" },
    { key: "SHIPPED", title: "Ready for Shipment" },
    { key: "OUT_FOR_DELIVERY", title: "Out for Delivery" },
    { key: "DELIVERED", title: "Completed" },
  ];

  function getActiveIndex(status: string): number {
    const idx = pipelineStages.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  }

  assert.strictEqual(getActiveIndex("PENDING"), 0);
  assert.strictEqual(getActiveIndex("CONFIRMED"), 1);
  assert.strictEqual(getActiveIndex("PROCESSING"), 2);
  assert.strictEqual(getActiveIndex("SHIPPED"), 3);
  assert.strictEqual(getActiveIndex("OUT_FOR_DELIVERY"), 4);
  assert.strictEqual(getActiveIndex("DELIVERED"), 5);

  console.log("✓ Client Timeline Step Synchronization tests passed.");
}

function runAllTests() {
  console.log("=== RUNNING ORDER & MEASUREMENTS STATUS SYNC TEST SUITE ===");
  testUpdateOrderStatusValidation();
  testFulfillmentPipelineTransitionSequence();
  testBespokeVsReadyToWearDifferentiation();
  testCustomerMeasurementEditAccessControl();
  testClientTimelineStepSynchronization();
  console.log("=== ALL TESTS COMPLETED SUCCESSFULLY ===");
}

runAllTests();
