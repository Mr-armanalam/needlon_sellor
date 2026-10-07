# Production Implementation Plan: Seller Profile & Verification System

## 1. Executive Summary & Live Browser Audit Findings

A live inspection of the seller profile workspace at `http://localhost:3000/profile` and `/profile/verification` was conducted with seller credentials `armanalam78578@gmail.com`.

### 1.1. Submenu-by-Submenu Findings

| Submenu Tab | Current Component | Current Status | Issues & Required Enhancements |
|---|---|---|---|
| **Overview** | [`active-profile-overview-section.tsx`](file:///d:/web%20development/project/needlon_sellor-main/needlon_sellor-main/packages/modules/modules/seller-profile/section/active-profile-overview-section.tsx) | Partially dynamic | Hardcoded greeting: `"Welcome back, Arman 👋"`. Must dynamically retrieve the authenticated seller's `displayName` from [`useSellerProfile`](file:///d:/web%20development/project/needlon_sellor-main/needlon_sellor-main/packages/modules/modules/seller-profile/hooks/use-seller-profile.ts) with graceful fallback. |
| **Business Identity** | [`buisiness-identity-section.tsx`](file:///d:/web%20development/project/needlon_sellor-main/needlon_sellor-main/packages/modules/modules/seller-profile/section/buisiness-identity-section.tsx) | Partially dynamic | GSTIN and PAN cards are grouped in a single `<Link>` with invalid nested `<button>`s. Lacks dynamic display of existing GSTIN and PAN document statuses/numbers. Clicking should cleanly route to `/profile/verification`. |
| **Store Management** | [`store-management.tsx`](file:///d:/web%20development/project/needlon_sellor-main/needlon_sellor-main/packages/modules/modules/seller-profile/section/store-management.tsx) | Dynamic | Next.js image domain configuration in [`next.config.ts`](file:///d:/web%20development/project/needlon_sellor-main/needlon_sellor-main/apps/seller/next.config.ts) is missing `**.supabase.co` remote pattern, causing unconfigured host errors when rendering uploaded logos/banners. |
| **Bank & Payout** | [`bank-and-payout.tsx`](file:///d:/web%20development/project/needlon_sellor-main/needlon_sellor-main/packages/modules/modules/seller-profile/section/bank-and-payout.tsx) | Dynamic | Successfully displays linked SBI account and UPI cards; slide-over drawer and delete confirmation dialog are wired. |
| **Address Management** | [`address-management.tsx`](file:///d:/web%20development/project/needlon_sellor-main/needlon_sellor-main/packages/modules/modules/seller-profile/section/address-management.tsx) | Dynamic | Addresses load dynamically with primary badge; drawer allows adding warehouse and pickup addresses. |
| **Preferences / Settings** | [`seller-setting.tsx`](file:///d:/web%20development/project/needlon_sellor-main/needlon_sellor-main/packages/modules/modules/seller-profile/section/seller-setting.tsx) | Disconnected from live app shell | 1. **Theme**: Clicking Light/Dark/System only updates form state; does not call `setTheme` from `next-themes` (active app theme does not switch in real-time).<br>2. **Language**: Hardcoded dropdown with only 3 options instead of full `SUPPORTED_LANGUAGES`.<br>3. **Currency**: Disabled read-only field instead of interactive currency picker (`SUPPORTED_CURRENCIES`).<br>4. **Notifications**: Missing real-time test notification trigger and push permission authorization found in Settings and Navbar. |
| **Verification Page** | [`seller-verification-section.tsx`](file:///d:/web%20development/project/needlon_sellor-main/needlon_sellor-main/packages/modules/modules/seller-profile/components/seller-verification-section.tsx) | Dynamic | Mounted at `/profile/verification`. Manages document uploads for GST, PAN, MSME, FSSAI, timeline tracking, and submission. |

---

## 2. Business Entity Relational Validation

The business requirements require validating and representing the relationship between:
1. **Account Profile (`seller_profiles`)**: Legal business owner identity (`displayName`, `phoneNumber`, `businessType`, `supportEmail`).
2. **Storefront Identity (`seller_store`)**: Store branding (`storeName`, `storeSlug`, `description`, `logoUrl`, `bannerUrl`, `isVerified`).
3. **Bank & Payouts (`seller_bank_account`)**: Financial settlement route (`accountHolderName`, `accountNumber`, `ifscCode`, `bankName`, `verificationStatus`).
4. **Government Documents & Store Verification (`seller_verification`, `seller_documents`)**:
   - `GST`: Legal GSTIN registration (contains 10-digit PAN in characters 3-12).
   - `PAN`: Tax identity verifying the proprietor or company.
   - When GST and PAN documents are verified, the overall seller verification status progresses to `VERIFIED`, enabling the `isVerified` store badge across the platform.

```
┌───────────────────────────┐         ┌───────────────────────────┐
│     Account Profile       │         │       Seller Store        │
│    (seller_profiles)      │         │      (seller_store)       │
│  - displayName            │         │  - storeName              │
│  - businessType           │◄───────►│  - storeSlug              │
│  - phoneNumber            │         │  - isVerified ────────┐   │
└─────────────┬─────────────┘         └───────────────────────┼───┘
              │                                               │
              │                                               │
              ▼                                               ▼
┌───────────────────────────┐         ┌───────────────────────────┐
│       Bank Account        │         │    Seller Verification    │
│   (seller_bank_account)   │         │   (seller_verification)   │
│  - accountHolderName      │         │  - status (VERIFIED)  │
│  - accountNumberLast4     │         │  - documents:             │
│  - ifscCode               │         │    • GSTIN Certificate    │
│  - verificationStatus     │         │    • Business PAN Card    │
└───────────────────────────┘         └───────────────────────────┘
```

---

## 3. Detailed Component Upgrades

### 3.1. `next.config.ts`: Remote Image Domains
Update `apps/seller/next.config.ts` to include `**.supabase.co` and `images.unsplash.com` under `images.remotePatterns` to prevent Next.js image optimization crashes when displaying store logos and banners.

### 3.2. `active-profile-overview-section.tsx`: Dynamic Greeting
- Import and use `useSellerProfile()` to retrieve `profile.displayName`.
- Replace hardcoded `"Welcome back, Arman 👋"` with `` `Welcome back, ${profile?.displayName || "Seller"} 👋` ``.

### 3.3. `buisiness-identity-section.tsx`: Dynamic GST & PAN Status
- Connect to `useVerificationForm()` to check uploaded documents (`DocumentType.GST`, `DocumentType.PAN`).
- For GSTIN:
  - If uploaded: Display document number (`doc.documentNumber`), status badge (`VERIFIED` / `UNDER_REVIEW`), and a `"View"` button linking to `/profile/verification`.
  - If not uploaded: Display `"Optional Verification"` and `"Add"` button linking to `/profile/verification`.
- For PAN Card:
  - If uploaded: Display document number, status badge, and `"View"` button.
  - If not uploaded: Display `"Optional Verification"` and `"Add"` button.
- Clean up invalid nested buttons inside `<Link>`.

### 3.4. `seller-setting.tsx`: Preferences Alignment with Navbar & Settings
- **Theme Switching**: Integrate `useTheme()` from `next-themes`. Clicking "Light", "Dark", or "System" instantly calls `setTheme("light" | "dark" | "system")` and saves `updateSettings({ theme })` to the backend.
- **Language Selection**: Use `SUPPORTED_LANGUAGES` from `useSellerSettings` (English, Hindi, Spanish, French, German, Arabic, Japanese, Chinese) and persist changes immediately.
- **Currency Selection**: Make settlement currency interactive using `SUPPORTED_CURRENCIES` (INR, USD, EUR, GBP, JPY, CAD, AUD) and persist changes.
- **Notification Matrix**: Support email, SMS, push, order, and payout notifications with real-time toggle handlers, matching the top Navbar notification bell and Settings tab.

### 3.5. TypeScript Quality Standards
- Strictly **zero use of `any` type** across all modified files.
- Use explicit TypeScript interfaces and types for all props, states, and callbacks.

---

## 4. Testing Strategy

Create and execute unit tests in [`packages/modules/tests/seller-profile.test.ts`](file:///d:/web%20development/project/needlon_sellor-main/needlon_sellor-main/packages/modules/tests/seller-profile.test.ts) covering:
1. **Settings DTO Validations**: Theme enum, language code, currency code, and notification booleans via Zod.
2. **GSTIN & PAN Relationship Logic**: Extracting PAN from GSTIN (chars 3-12) and validating PAN format.
3. **Verification Status Progression**: Progression from `NOT_SUBMITTED` -> `PENDING` -> `UNDER_REVIEW` -> `VERIFIED`.

---

## 5. Phased Execution Steps

1. **Step 1**: Update `apps/seller/next.config.ts` to whitelist Supabase and Unsplash image hostnames.
2. **Step 2**: Update `ActiveProfileOverviewSection` to dynamically display the seller's real name.
3. **Step 3**: Re-architect `SellerSettingsSection` to provide real-time theme switching via `useTheme`, dynamic languages, dynamic currencies, and notifications aligned with Settings.
4. **Step 4**: Upgrade `BusinessIdentitySection` with dynamic GST & PAN card status, independent routing to `/profile/verification`, and validation linking.
5. **Step 5**: Write and execute unit tests in `packages/modules/tests/seller-profile.test.ts`.
6. **Step 6**: Live browser audit and verification across all profile submenus.
