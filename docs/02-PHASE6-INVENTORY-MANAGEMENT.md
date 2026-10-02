# Phase 6 Implementation Plan — Inventory & Stock Management

## Objective
Establish complete control over inventory, SKU stock levels, warehouse stock allocation, and automated low-stock warnings across product variants.

---

## Existing Assets & References
- **Database Schema**: `db/schema/catalog/products/inventory/`
- **Product Module**: `modules/products/`
- **UI Views**: `modules/products/view/products-shelf.tsx`

---

## Step-by-Step Implementation Steps

### Step 6.1: Inventory Schema & Repository Wiring
- **Task**: Create inventory repositories and DTOs to fetch, update, and reserve stock for product variants.
- **Target Files**:
  - `modules/products/repository/inventory-repository.ts`
  - `modules/products/dto/inventory.dto.ts`

### Step 6.2: SKU & Variant Stock Management UI
- **Task**: Add inventory controls into product edit modals and product tables.
- **Target Files**:
  - `modules/products/components/inventory-manager.tsx`
  - `modules/products/hooks/use-inventory.ts`
- **Details**:
  - Allow quick bulk stock updates (quantity in stock, reserved quantity, safety stock).
  - Allow SKU creation and barcode/UPC mapping per variant.

### Step 6.3: Automated Low-Stock Alert System
- **Task**: Implement low-stock alert calculation service.
- **Target Files**:
  - `app/api/seller/inventory/alerts/route.ts`
  - `modules/products/services/inventory-service.ts`
- **Details**:
  - Trigger warning state when `quantity_available <= reorder_level`.
  - Provide low-stock filter tab in products overview.

### Step 6.4: Order-Inventory Synchronization
- **Task**: Hook order placement and cancellation events into stock reservation.
- **Target Files**:
  - `modules/orders/services/order-service.ts`
- **Details**:
  - Reserve stock when an order is created.
  - Deduct stock when an order is confirmed/shipped.
  - Release stock back to inventory if an order is cancelled.

### Step 6.5: Automated Testing
- **Task**: Write unit tests for inventory deduction, stock reservation, and low-stock alerts.
- **Target File**: `modules/products/inventory.test.ts`
- **Details**:
  - Verify concurrent stock deduction protection.
  - Test reorder threshold calculations.

---

## Verification & Definition of Done
- ✅ Sellers can view and adjust stock levels per SKU.
- ✅ Low-stock products are highlighted with warnings on dashboard & products table.
- ✅ Orders automatically reserve and deduct stock levels.
- ✅ Inventory unit tests pass cleanly.
