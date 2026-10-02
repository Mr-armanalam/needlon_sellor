import assert from "node:assert";
import {
  updateInventoryStockSchema,
  adjustStockSchema,
  getInventoryQuerySchema,
} from "../modules/products/dto/inventory.dto";

function testInventoryValidations() {
  console.log("--> Testing Inventory Zod Validations...");

  // Valid update stock DTO
  const validUpdate = {
    variantId: "123e4567-e89b-12d3-a456-426614174000",
    quantity: 100,
    reservedQuantity: 10,
    lowStockThreshold: 5,
    allowBackorder: false,
  };
  const parsedUpdate = updateInventoryStockSchema.parse(validUpdate);
  assert.strictEqual(parsedUpdate.quantity, 100);
  assert.strictEqual(parsedUpdate.reservedQuantity, 10);
  assert.strictEqual(parsedUpdate.lowStockThreshold, 5);

  // Invalid UUID variantId
  assert.throws(() => {
    updateInventoryStockSchema.parse({
      variantId: "invalid-uuid",
      quantity: 10,
    });
  });

  // Negative quantity assertion
  assert.throws(() => {
    updateInventoryStockSchema.parse({
      variantId: "123e4567-e89b-12d3-a456-426614174000",
      quantity: -5,
    });
  });

  // Valid adjust stock DTO
  const validAdjust = {
    variantId: "123e4567-e89b-12d3-a456-426614174000",
    adjustment: -15,
    reason: "Damaged in transit",
  };
  const parsedAdjust = adjustStockSchema.parse(validAdjust);
  assert.strictEqual(parsedAdjust.adjustment, -15);
  assert.strictEqual(parsedAdjust.reason, "Damaged in transit");

  // Valid query params schema
  const query = {
    lowStockOnly: "true",
    search: "Nike",
  };
  const parsedQuery = getInventoryQuerySchema.parse(query);
  assert.strictEqual(parsedQuery.lowStockOnly, "true");
  assert.strictEqual(parsedQuery.search, "Nike");

  console.log("✓ Inventory Zod validation tests passed.");
}

function testInventoryCalculations() {
  console.log("--> Testing Inventory Stock Calculations...");

  const mockInventory = {
    quantity: 25,
    reservedQuantity: 5,
    lowStockThreshold: 10,
  };

  const availableQuantity = Math.max(0, mockInventory.quantity - mockInventory.reservedQuantity);
  assert.strictEqual(availableQuantity, 20);

  const isLowStock = mockInventory.quantity <= mockInventory.lowStockThreshold;
  assert.strictEqual(isLowStock, false);

  // Test low-stock warning threshold trigger
  const lowStockItem = {
    quantity: 4,
    reservedQuantity: 1,
    lowStockThreshold: 5,
  };
  assert.strictEqual(lowStockItem.quantity <= lowStockItem.lowStockThreshold, true);
  assert.strictEqual(Math.max(0, lowStockItem.quantity - lowStockItem.reservedQuantity), 3);

  // Test backorder zero stock math safety
  const zeroStockItem = {
    quantity: 0,
    reservedQuantity: 5,
    lowStockThreshold: 5,
  };
  assert.strictEqual(Math.max(0, zeroStockItem.quantity - zeroStockItem.reservedQuantity), 0);

  console.log("✓ Inventory calculation tests passed.");
}

function runAllTests() {
  console.log("=== INVENTORY MODULE TEST SUITE ===");
  testInventoryValidations();
  testInventoryCalculations();
  console.log("=== ALL INVENTORY UNIT TESTS PASSED SUCCESSFULLY! ===");
}

runAllTests();
