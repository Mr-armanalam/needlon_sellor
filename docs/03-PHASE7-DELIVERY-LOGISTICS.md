# Phase 7 Implementation Plan — Delivery & Logistics Integration

## Objective
Provide full seller logistics management including carrier configurations, shipping profile rules, dispatch label generation, and real-time shipment status tracking.

---

## Existing Assets & References
- **Database Schemas**: `db/schema/delivery/` and `db/schema/orders/order-shipments/`
- **Module Structure**: `modules/delivery/`
- **UI Route**: `app/(seller)/delivery/page.tsx`

---

## Step-by-Step Implementation Steps

### Step 7.1: Seller Shipping Settings & Profiles
- **Task**: Implement shipping profiles (e.g. Free Shipping, Flat Rate, Weight-Based, Express).
- **Target Files**:
  - `app/api/seller/delivery/profiles/route.ts`
  - `modules/delivery/services/shipping-profile-service.ts`
  - `modules/delivery/section/delivery-page.tsx`

### Step 7.2: Shipping Carrier Integration & Tracking
- **Task**: Connect shipping carriers, tracking numbers, and external status mapping.
- **Target Files**:
  - `modules/delivery/repository/carrier-repository.ts`
  - `app/api/seller/delivery/shipments/route.ts`

### Step 7.3: Label Generation & Dispatch Management
- **Task**: Allow sellers to select pending orders, generate shipping labels, and mark packages as dispatched.
- **Target Files**:
  - `modules/delivery/components/label-generator.tsx`
  - `modules/delivery/components/dispatch-table.tsx`

### Step 7.4: Delivery Analytics & Delay Tracking
- **Task**: Display delivery performance metrics (on-time delivery rate, transit delay warnings).
- **Target Files**:
  - `modules/delivery/components/delivery-stats.tsx`

### Step 7.5: Automated Testing
- **Task**: Write unit tests for shipping rate calculations and carrier tracking updates.
- **Target File**: `tests/delivery.test.ts`

---

## Verification & Definition of Done
- ✅ Sellers can configure shipping zones and rate rules.
- ✅ Orders can be assigned tracking numbers and printed shipping labels.
- ✅ Delivery status is updated and synced with order fulfillment.
- ✅ Logistics unit tests pass cleanly.
