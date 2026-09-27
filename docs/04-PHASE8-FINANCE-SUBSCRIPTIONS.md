# Phase 8 Implementation Plan — Finance, Earnings & Subscriptions

## Objective
Implement seller earnings management, payout withdrawal requests, platform commission handling, and seller tier subscription plans.

---

## Existing Assets & References
- **Database Schemas**: `db/schema/subscription/`, `db/schema/seller/seller-payout-method.ts`, `seller-bank-account.ts`
- **Module Structure**: `modules/earnings/`, `modules/subscription/`
- **UI Routes**: `app/(seller)/earnings/page.tsx`, `app/(seller)/subscription/page.tsx`

---

## Step-by-Step Implementation Steps

### Step 8.1: Earnings Breakdown & Payout Request System
- **Task**: Hook live earnings calculations (Gross Sales, Net Revenue, Platform Fees, Available Payout Balance).
- **Target Files**:
  - `app/api/seller/earnings/route.ts`
  - `app/api/seller/payouts/request/route.ts`
  - `modules/earnings/section/earningsPage.tsx`

### Step 8.2: Bank Account & Payout Method Management
- **Task**: Connect bank details update and withdrawal destination setting with seller verification.
- **Target Files**:
  - `app/api/seller/bank/route.ts`
  - `modules/earnings/components/bank-account-modal.tsx`

### Step 8.3: Subscription Tiers & Feature Plan Enforcement
- **Task**: Build subscription plan selection (Basic, Pro, Enterprise) and enforce tier limits (e.g. Max product listings, commission rates).
- **Target Files**:
  - `app/api/seller/subscription/route.ts`
  - `modules/subscription/section/subscription-page.tsx`
  - `modules/auth/lib/auth-config.ts` (Plan guards)

### Step 8.4: Automated Testing
- **Task**: Write unit tests for fee calculation logic, balance payout validation, and tier limits.
- **Target File**: `tests/finance.test.ts`

---

## Verification & Definition of Done
- ✅ Sellers can view revenue metrics, balance breakdown, and payout history.
- ✅ Payout requests can be submitted to connected bank accounts.
- ✅ Subscription plans can be upgraded or downgraded.
- ✅ Finance unit tests pass cleanly.
