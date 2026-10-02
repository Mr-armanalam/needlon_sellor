# Phase 5 Implementation Plan — Orders & Fulfillment Management

## Objective
Fully integrate the backend Drizzle order schemas, repositories, and services with the seller orders dashboard UI ([OrdersPage](file:///d:/web%20development/project/needlon_seller/app/(seller)/orders/page.tsx)).

---

## Existing Assets & References
- **Database Schemas**: `db/schema/orders/` (`table.ts`, `order-items`, `order-address.ts`, `order-invoices.ts`, `order-payments`, `order-refunds`, `order-returns`, `order-shipments`, `order-status-history`)
- **Module Structure**: `modules/orders/`
- **UI Entry Point**: `app/(seller)/orders/page.tsx`
- **Tests**: `tests/orders.test.ts`

---

## Step-by-Step Implementation Steps

### Step 5.1: Order Query & Data Fetching Integration
- **Task**: Connect `modules/orders/hooks/use-orders.ts` or custom TanStack Query hook to `/api/seller/orders`.
- **Target Files**:
  - `modules/orders/api/order-api.ts`
  - `modules/orders/hooks/use-orders.ts`
- **Details**:
  - Implement paginated order fetching with status filtering (`pending`, `processing`, `shipped`, `delivered`, `cancelled`).
  - Add search capabilities (by Order ID, Customer Name, SKU).

### Step 5.2: Order Detail Modal & Item Breakdown
- **Task**: Build/Wire the Order Details view modal/sheet showing items, pricing breakdown, shipping address, and payment status.
- **Target Files**:
  - `modules/orders/components/order-details-modal.tsx`
  - `modules/orders/services/order-service.ts`
- **Details**:
  - Fetch complete order payload including items, buyer contact, shipping details, and invoice state.

### Step 5.3: Order Status Workflow & Actions
- **Task**: Implement order state transitions (e.g. `Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).
- **Target Files**:
  - `app/api/seller/orders/[id]/status/route.ts`
  - `modules/orders/repositery/order-repository.ts`
  - `db/schema/orders/order-status-history/`
- **Details**:
  - Validate state transitions using Zod.
  - Record history timestamp and seller note in `order-status-history`.

### Step 5.4: Shipping & Manifest Generation
- **Task**: Add functionality for shipping assignment, tracking number entry, and dispatch manifest generation.
- **Target Files**:
  - `app/api/seller/orders/[id]/manifest/route.ts`
  - `modules/orders/documents/` (PDF / Printable HTML invoice/manifest)
- **Details**:
  - Generate packing slips & dispatch manifests for fulfillment.

### Step 5.5: Returns & Refunds Management
- **Task**: Wire customer return request review, approval/rejection, and refund calculation.
- **Target Files**:
  - `app/api/seller/orders/[id]/refund/route.ts`
  - `db/schema/orders/order-refunds/` & `order-returns/`
- **Details**:
  - Provide seller controls to accept return, mark item as received, and initiate refund record.

### Step 5.6: Automated Unit & Integration Testing
- **Task**: Write comprehensive unit tests for all new order functions.
- **Target File**: `tests/orders.test.ts`
- **Details**:
  - Test status transition validity.
  - Test invoice & refund calculations.
  - Run tests with `npx tsx tests/orders.test.ts`.

---

## Verification & Definition of Done
- ✅ All order tabs (All, Pending, Processing, Shipped, Cancelled) display real data from DB.
- ✅ Order status can be updated seamlessly with recorded audit history.
- ✅ Invoices and manifests can be viewed and printed.
- ✅ All unit tests pass cleanly without errors.
