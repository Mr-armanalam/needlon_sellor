# Implementation Plan — Production-Grade Help Center & Feedback Ecosystem

## 1. Executive Summary & Audit Findings

Based on the live browser inspection and codebase audit of the **Needlon Seller** application:
- **Help Center (`/help`)**:
  - The **Help Dashboard** contains static onboarding checklists, hardcoded academy progress (`65%`), static trending videos, and an interactive search input without backend query execution.
  - The **Knowledge Base** contains a hardcoded JavaScript object (`guideSections`) with mock article previews and mock article text.
  - The **Support Center** relies on [`useSupport()`](file:///d:/web%20development/project/needlon_sellor-main/needlon_sellor-main/packages/modules/modules/help/hooks/use-support.ts), which communicates with [`support.repository.ts`](file:///d:/web%20development/project/needlon_sellor-main/needlon_sellor-main/packages/modules/modules/help/repository/support.repository.ts) backed by an **in-memory JavaScript `Map` store** (`sellerTicketsStore`). Message timeline replies and status toggles ("Close Ticket", "Reopen Ticket") operate strictly in local React state.
- **Feedback Ecosystem (`/feedback`)**:
  - The **Feature Roadmap** uses static mock items (`mockRoadmapItems`). Upvoting and filtering update local state only.
  - The **Share Feedback Form** collects user inputs and device telemetry, but submitting the form triggers a browser `alert()` without saving any data to the server or database.
  - The **Tracker Status** micro-survey star rating updates local React state (`setSurveySubmitted`), and the status list displays tickets instead of dedicated feedback submissions.

### Objective
Transition both the **Help Center** and **Feedback Ecosystem** modules to a 100% database-driven, dynamic, reusable, and production-grade architecture. All hardcoded data and temporary in-memory stores will be replaced with PostgreSQL tables, Drizzle ORM repositories, validated RESTful API routes, custom hooks, real-time micro-interactions, sonner toast feedback, and automated test coverage.

---

## 2. Architecture & Data Flow Overview

```mermaid
graph TD
    subgraph UI Layer - Help Module
        HD[Help Dashboard: Smart Search & Academy]
        KB[Knowledge Base: Guides & Articles Viewer]
        SC[Support Center: Channels, Tickets & Timeline]
    end

    subgraph UI Layer - Feedback Module
        FR[Feature Roadmap: Upvoting & Discussions]
        FF[Feedback Form: Telemetry & File Uploads]
        FT[Feedback Tracker: Micro-Surveys & Ledger]
    end

    subgraph State & Hook Layer
        UseHelp[useHelpCenter Hook]
        UseKB[useKnowledgeBase Hook]
        UseSupport[useSupport Hook]
        UseFeedback[useFeedback Ecosystem Hook]
    end

    subgraph API Route Layer
        APIHelp["/api/seller/help/* (search, dashboard, kb, academy)"]
        APISupport["/api/seller/support/tickets/* (crud, reply, status)"]
        APIFeedback["/api/seller/feedback/* (roadmap, vote, comments, submit, survey)"]
    end

    subgraph Database Layer (PostgreSQL / Drizzle ORM)
        DB_Support[(seller_support_tickets & support_ticket_messages)]
        DB_KB[(knowledge_base_articles & seller_academy_progress)]
        DB_Feedback[(seller_feedbacks & feedback_roadmap_items & feedback_upvotes & feedback_comments & seller_surveys)]
    end

    HD <--> UseHelp
    KB <--> UseKB
    SC <--> UseSupport
    FR <--> UseFeedback
    FF <--> UseFeedback
    FT <--> UseFeedback

    UseHelp <--> APIHelp
    UseKB <--> APIHelp
    UseSupport <--> APISupport
    UseFeedback <--> APIFeedback

    APIHelp <--> DB_KB
    APISupport <--> DB_Support
    APIFeedback <--> DB_Feedback
```

---

## 3. Database Schema Definitions (PostgreSQL / Drizzle ORM)

All schemas will be defined in `@needlon/db` under dedicated domain subdirectories:

### A. Support & Help Schemas (`packages/db/db/schema/help/`)
1. **`seller_support_tickets`**:
   - `id`: `uuid` (Primary Key, default `gen_random_uuid()`)
   - `sellerId`: `uuid` (Foreign Key -> `seller.id`, NOT NULL)
   - `ticketNumber`: `varchar(32)` (Unique Ticket Reference, e.g. `TKT-849201`)
   - `subject`: `varchar(255)` (NOT NULL)
   - `category`: `varchar(64)` (`ORDER_ISSUE`, `PAYMENT_PAYOUT`, `PRODUCT_CATALOG`, `ACCOUNT_SETTINGS`, `OTHER`)
   - `priority`: `varchar(32)` (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
   - `status`: `varchar(32)` (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`)
   - `assignedAgent`: `varchar(128)` (Default: `'Support Desk'`)
   - `createdAt`: `timestamp` (default `now()`)
   - `updatedAt`: `timestamp` (default `now()`)

2. **`support_ticket_messages`**:
   - `id`: `uuid` (Primary Key)
   - `ticketId`: `uuid` (Foreign Key -> `seller_support_tickets.id`, ON DELETE CASCADE)
   - `senderType`: `varchar(32)` (`seller`, `agent`, `system`)
   - `senderName`: `varchar(128)`
   - `message`: `text` (NOT NULL)
   - `attachments`: `jsonb` (Array of file URLs / metadata)
   - `createdAt`: `timestamp` (default `now()`)

3. **`knowledge_base_articles`**:
   - `id`: `uuid` (Primary Key)
   - `category`: `varchar(64)` (`selling`, `delivery`, `payment`, `account`, `marketing`)
   - `title`: `varchar(255)` (NOT NULL)
   - `slug`: `varchar(255)` (Unique)
   - `description`: `text`
   - `content`: `text` (Markdown / rich content body)
   - `readTime`: `varchar(32)` (e.g. `'4 min read'`)
   - `icon`: `varchar(64)` (Lucide icon identifier)
   - `views`: `integer` (default `0`)
   - `helpfulVotes`: `integer` (default `0`)
   - `unhelpfulVotes`: `integer` (default `0`)
   - `createdAt`: `timestamp` (default `now()`)

4. **`seller_academy_progress`**:
   - `id`: `uuid` (Primary Key)
   - `sellerId`: `uuid` (Foreign Key -> `seller.id`)
   - `itemId`: `varchar(128)` (Article or Video ID)
   - `itemType`: `varchar(32)` (`article`, `video`, `onboarding_task`)
   - `progressPercent`: `integer` (default `0`)
   - `isCompleted`: `boolean` (default `false`)
   - `updatedAt`: `timestamp` (default `now()`)

5. **`seller_callback_requests`**:
   - `id`: `uuid` (Primary Key)
   - `sellerId`: `uuid` (Foreign Key -> `seller.id`)
   - `phoneNumber`: `varchar(32)` (NOT NULL)
   - `preferredTimeSlot`: `varchar(64)`
   - `reason`: `text`
   - `status`: `varchar(32)` (`PENDING`, `COMPLETED`, `CANCELLED`)
   - `createdAt`: `timestamp` (default `now()`)

---

### B. Feedback Schemas (`packages/db/db/schema/feedback/`)
1. **`feedback_roadmap_items`**:
   - `id`: `uuid` (Primary Key)
   - `title`: `varchar(255)` (NOT NULL)
   - `description`: `text` (NOT NULL)
   - `category`: `varchar(64)` (`Product Management`, `Marketing Push`, `UI Improvement`, `Checkout & Payments`, `Logistics`)
   - `status`: `varchar(32)` (`Planned`, `In Development`, `Released`)
   - `upvoteCount`: `integer` (default `0`)
   - `commentsCount`: `integer` (default `0`)
   - `createdAt`: `timestamp` (default `now()`)

2. **`feedback_upvotes`**:
   - `id`: `uuid` (Primary Key)
   - `featureId`: `uuid` (Foreign Key -> `feedback_roadmap_items.id`, ON DELETE CASCADE)
   - `sellerId`: `uuid` (Foreign Key -> `seller.id`, ON DELETE CASCADE)
   - `createdAt`: `timestamp` (default `now()`)
   - *Constraint*: Unique `(featureId, sellerId)` pair.

3. **`feedback_comments`**:
   - `id`: `uuid` (Primary Key)
   - `featureId`: `uuid` (Foreign Key -> `feedback_roadmap_items.id`, ON DELETE CASCADE)
   - `sellerId`: `uuid` (Foreign Key -> `seller.id`)
   - `sellerName`: `varchar(128)`
   - `comment`: `text` (NOT NULL)
   - `createdAt`: `timestamp` (default `now()`)

4. **`seller_feedbacks`**:
   - `id`: `uuid` (Primary Key)
   - `sellerId`: `uuid` (Foreign Key -> `seller.id`)
   - `feedbackNumber`: `varchar(32)` (Unique, e.g. `FB-920148`)
   - `title`: `varchar(255)` (NOT NULL)
   - `category`: `varchar(64)` (`Bug Report`, `Feature Request`, `General Feedback`, `Improvement Suggestion`, `Compliment`, `Complaint`, `Payment Issue`, `Delivery Issue`, `Product Management Issue`, `Other`)
   - `priority`: `varchar(32)` (`Low`, `Medium`, `High`)
   - `description`: `text` (NOT NULL)
   - `deviceInfo`: `varchar(128)`
   - `browserInfo`: `varchar(128)`
   - `appVersion`: `varchar(64)`
   - `status`: `varchar(32)` (`SUBMITTED`, `UNDER_REVIEW`, `IN_DEVELOPMENT`, `RESOLVED`, `REJECTED`)
   - `createdAt`: `timestamp` (default `now()`)

5. **`seller_surveys`**:
   - `id`: `uuid` (Primary Key)
   - `sellerId`: `uuid` (Foreign Key -> `seller.id`)
   - `rating`: `integer` (1 to 5, NOT NULL)
   - `feedbackText`: `text`
   - `context`: `varchar(128)` (e.g. `'Product listing workflow'`)
   - `createdAt`: `timestamp` (default `now()`)

---

## 4. API Endpoints Architecture

All API routes will be implemented under `apps/seller/app/api/seller/` with strict authentication checks (`getSellerSession`), Zod input validation, proper HTTP status codes, and structured JSON responses (`{ success: true, data: ... }`).

### A. Help Center API Routes
- **`GET /api/seller/help/dashboard`**: Returns dynamic dashboard metadata:
  - Seller setup checklist status (from DB onboarding table).
  - Seller overall academy completion percentage.
  - Trending video lessons with seller watch progress.
- **`GET /api/seller/help/search?q=...`**: Multi-entity search across Knowledge Base articles, FAQs, and seller support tickets.
- **`GET /api/seller/help/kb`**: Returns Knowledge Base categories and article listings.
- **`GET /api/seller/help/kb/articles/[id]`**: Returns full article body content and increments view count.
- **`POST /api/seller/help/kb/articles/[id]/vote`**: Submits helpful / unhelpful article vote.
- **`POST /api/seller/help/academy/progress`**: Records video/article completion or watch percentage.
- **`POST /api/seller/help/callback`**: Submits request for callback with phone number and reason.

### B. Support Tickets API Routes
- **`GET /api/seller/support/tickets`**: Lists seller's tickets with status filtering (`OPEN`, `CLOSED`, `ALL`).
- **`POST /api/seller/support/tickets`**: Creates new support ticket, generates unique ticket number, and creates initial message record.
- **`GET /api/seller/support/tickets/[ticketId]`**: Retrieves ticket details, assigned agent info, and full timeline messages.
- **`POST /api/seller/support/tickets/[ticketId]/reply`**: Appends seller reply message to ticket timeline.
- **`PATCH /api/seller/support/tickets/[ticketId]/status`**: Updates ticket status (`OPEN` <-> `CLOSED` / `RESOLVED`).

### C. Feedback Ecosystem API Routes
- **`GET /api/seller/feedback/roadmap`**: Fetches roadmap items filtered by status (`all`, `planned`, `in-development`, `released`) along with seller upvote states.
- **`POST /api/seller/feedback/roadmap/[featureId]/vote`**: Toggles upvote for the authenticated seller.
- **`GET /api/seller/feedback/roadmap/[featureId]/comments`**: Fetches comment thread for a feature request.
- **`POST /api/seller/feedback/roadmap/[featureId]/comments`**: Posts a comment on a feature request.
- **`POST /api/seller/feedback/submit`**: Submits a new feedback entry with device telemetry metadata.
- **`GET /api/seller/feedback/tracker`**: Returns combined submission ledger (feedbacks + tickets) with live status badges.
- **`POST /api/seller/feedback/survey`**: Submits micro-survey rating and feedback comments.

---

## 5. UI/UX & Micro-Interactions Specification

In strict compliance with `AGENTS.md` ("Never modify the frontend ui design"), all existing UI layouts, color palettes, Tailwind classes, and icon configurations will be preserved while elevating every interactive element:

1. **Universal Smart Search Banner**:
   - Live debounced input with loading spinner.
   - Popover overlay showing top matching Knowledge Base articles and Support Tickets.
   - Keyboard navigation support (`Esc` to dismiss, `Enter` to search).

2. **Support Ticket Conversation Window**:
   - Real-time polling or refetch upon reply submission.
   - Smooth auto-scroll to bottom of conversation thread on message send.
   - Instant toggle for "Close Ticket" / "Reopen Ticket" with sonner toast notification ("Ticket status updated to Closed").

3. **Feature Roadmap Upvoting**:
   - Optimistic UI updates for immediate button response on upvote click.
   - Animated count change physics.
   - Interactive comments modal/drawer for discussing feature requests.

4. **Feedback Submission Form**:
   - Real browser telemetry collection (`navigator.userAgent`, `navigator.platform`).
   - Drag-and-drop file upload zone supporting image screenshots.
   - Clean form validation with inline error messages and sonner success toast.

5. **Customer Satisfaction Micro-Survey**:
   - Interactive star rating selector with hover effect.
   - Animated transition when survey is submitted.
   - DB persistence ensures survey does not reappear once completed by the seller.

---

## 6. Implementation Task Breakdown

| Phase | Description & Files | Deliverables |
| :--- | :--- | :--- |
| **Phase 1: DB Schemas & Seeding** | `packages/db/db/schema/help/*`<br>`packages/db/db/schema/feedback/*`<br>`packages/db/db/schema/index.ts` | Define all Drizzle ORM PostgreSQL tables for support tickets, ticket messages, KB articles, academy progress, roadmap items, upvotes, comments, seller feedbacks, and surveys. Include initial seed data script. |
| **Phase 2: DTOs, Repositories & Services** | `packages/modules/modules/help/dto/*`<br>`packages/modules/modules/help/repository/*`<br>`packages/modules/modules/help/services/*`<br>`packages/modules/modules/feedback/dto/*`<br>`packages/modules/modules/feedback/repository/*`<br>`packages/modules/modules/feedback/services/*` | Create Zod validation schemas and repository layers executing real Drizzle ORM database queries (replacing in-memory Map stores). |
| **Phase 3: Backend API Routes** | `apps/seller/app/api/seller/support/tickets/*`<br>`apps/seller/app/api/seller/help/*`<br>`apps/seller/app/api/seller/feedback/*` | Build Next.js App Router API handlers with seller session authentication, error handling, and structured JSON outputs. |
| **Phase 4: Module Hooks** | `packages/modules/modules/help/hooks/use-support.ts`<br>`packages/modules/modules/help/hooks/use-help-center.ts`<br>`packages/modules/modules/feedback/hooks/use-feedback.ts` | Develop comprehensive React hooks managing SWR / fetch state, refetching, mutations, optimistic updates, and error handling. |
| **Phase 5: Frontend Component Integration** | `packages/modules/modules/help/section/help-center-page.tsx`<br>`packages/modules/modules/help/view/*`<br>`packages/modules/modules/feedback/section/feedback-center-page.tsx`<br>`packages/modules/modules/feedback/view/*` | Connect all views (`HelpDashboard`, `KnowledgeBase`, `SupportCenter`, `FeedbackRoadmap`, `FeedbackForm`, `FeedbackTracker`) to dynamic hooks and backend APIs. Replace all static/mock data. |
| **Phase 6: Automated Testing** | `packages/modules/tests/help-support.test.ts`<br>`packages/modules/tests/feedback-ecosystem.test.ts` | Write unit and integration test suites covering ticket creation, message posting, status changes, KB searches, feedback submission, upvote toggles, and survey recording. |
| **Phase 7: Live Browser Testing & QA** | Browser Subagent / Live Browser Inspection | Execute end-to-end verification in live browser using credentials `armanalam78578@gmail.com` / `Arman@123`. Verify every tab, form submit, ticket reply, upvote, and filter. |

---

## 8. Testing & Quality Assurance Plan

1. **Automated Backend & Repository Unit Tests**:
   - Validate `createSupportTicketSchema`, `createFeedbackSchema`, and `submitSurveySchema` with valid and invalid payloads.
   - Test support ticket repository functions (`createTicket`, `getTicketsBySeller`, `addTicketMessage`, `updateTicketStatus`).
   - Test roadmap repository functions (`getRoadmapItems`, `toggleUpvote`, `addComment`).
   - Test knowledge base search repository (`searchKBArticles`).
2. **End-to-End Live Browser Testing**:
   - Log in with credentials `email: armanalam78578@gmail.com`, `password: Arman@123`.
   - Navigate to `/help`:
     - Test smart search bar with live queries.
     - View Knowledge Base articles and click article details.
     - Open Support Center, raise a new ticket, view ticket timeline, send a reply, and toggle ticket status.
   - Navigate to `/feedback`:
     - Filter roadmap items, upvote/downvote a feature request, and open comment drawer.
     - Submit a feedback form with telemetry metadata and verify tracking entry.
     - Complete micro-survey rating and verify persistent completion state.
