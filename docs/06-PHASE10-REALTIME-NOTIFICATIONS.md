# Phase 10 Implementation Plan — Realtime Messaging & In-App Notifications

## Objective
Upgrade the seller messaging system with live Supabase WebSockets / Realtime channel subscriptions, and launch an in-app notification center for seller events.

---

## Existing Assets & References
- **Database Schemas**: `db/schema/messages/`, `db/schema/notifications/`
- **Module Structure**: `modules/message/`, `modules/shared/`
- **UI Views**: `modules/message/view/messagePage.tsx`, `modules/top-navbar/`

---

## Step-by-Step Implementation Steps

### Step 10.1: Supabase Realtime Messaging Integration
- **Task**: Subscribe to `messages` table insert events via `@supabase/supabase-js` channel listener.
- **Target Files**:
  - `lib/supabase/client.ts`
  - `modules/message/hooks/use-realtime-messages.ts`
  - `modules/message/view/messagePage.tsx`
- **Details**:
  - Automatically append new messages to current conversation without polling.
  - Update unread badge counts in real time.

### Step 10.2: In-App Notification Center
- **Task**: Implement notification bell dropdown in top navbar for order updates, buyer messages, low stock alerts, and payout status changes.
- **Target Files**:
  - `app/api/seller/notifications/route.ts`
  - `modules/top-navbar/` (Notification Dropdown Component)

### Step 10.3: Notification Preference Settings
- **Task**: Allow sellers to toggle email vs in-app alerts for specific event types.
- **Target Files**:
  - `app/api/seller/settings/notifications/route.ts`
  - `modules/settings/section/setting-page.tsx`

### Step 10.4: Automated Testing
- **Task**: Write unit tests for notification parsing, unread counter state transitions, and channel subscription handlers.
- **Target File**: `tests/notifications.test.ts`

---

## Verification & Definition of Done
- ✅ Messages sent by buyers appear instantaneously in the seller chat interface.
- ✅ Unread notifications update live in the top navbar bell icon.
- ✅ Notification preferences can be toggled by the seller.
- ✅ Realtime & notification unit tests pass cleanly.
