# Needlon Client Platform — Backend & Database Implementation Plan

## Overview
This document specifies the end-to-end architecture and implementation roadmap for connecting the **Needlon Client Application** (`apps/client` & `packages/client-packages`) to the PostgreSQL database via Drizzle ORM (`packages/db`).

---

## Architectural Guardrails & Constraints

1. **Zero Schema Deletions or Alterations**:
   - No existing tables, columns, data types, constraints, or enum values in `packages/db/db/schema/*` may be modified, renamed, or deleted.
   - Any new fields on existing shared tables are strictly prohibited unless critical conditions arise and consensus is achieved.

2. **Client-Only Database Tables**:
   - New database tables specific to the client storefront are isolated to `packages/db/db/schema/client/*`.
   - Never introduce seller-specific logic into client tables or vice versa.

3. **Strict Seller Workspace Isolation**:
   - Zero modifications to `apps/seller/**`.
   - Zero modifications to `packages/modules/**` (seller modules).

4. **Frontend UI Integrity**:
   - Frontend UI layouts, visual designs, animations, and Tailwind classes in `apps/client` must remain 100% unchanged.
   - Database queries must map through Data Transfer Object (DTO) transformers to match existing component data contracts exactly.

5. **Test-Driven Delivery**:
   - Every new repository and service function must include comprehensive unit and integration tests.

---

## Shared Database Schema Matrix

| Shared Schema Area | Drizzle Table Reference | DB Table Name | Client Read / Write Usage |
|---|---|---|---|
| **Users / Auth** | `usersTable` (`schema/users.ts`) | `users` | Read: Session & Profile. Write: Register, Profile updates. |
| **Password Reset** | `passwordResetTokens` (`schema/password-reset-tokens.ts`) | `password_reset_tokens` | Read: Token verification. Write: Create reset token, mark used. |
| **Catalog: Products** | `productsTable` (`schema/catalog/products/table.ts`) | `products` | Read: Product listings, details, new arrivals, best sellers. |
| **Catalog: Variants** | `productVariantsTable` (`schema/catalog/products/product-variants/table.ts`) | `product_variants` | Read: Size, color, SKU, variant options. |
| **Catalog: Pricing** | `pricingTable` (`schema/catalog/products/pricing/table.ts`) | `pricing` | Read: Variant pricing, MRP (compareAt), discounts. |
| **Catalog: Inventory** | `inventoryTable` (`schema/catalog/products/inventory/table.ts`) | `inventory` | Read: Stock availability. Write: Decrement on purchase. |
| **Catalog: Media** | `productImagesTable` (`schema/catalog/products/product-images/table.ts`) | `product_media` | Read: Product thumbnails, cover images, gallery views. |
| **Catalog: Categories** | `categoriesTable` (`schema/catalog/categories/table.ts`) | `categories` | Read: Nav menus, category hierarchy, breadcrumbs. |
| **Catalog: Attributes** | `categoryAttributesTable`, `categoryAttributeOptionsTable` | `category_attributes`, `category_attribute_options` | Read: Dynamic faceted filters and product specs. |
| **Orders** | `orders` (`schema/orders/table.ts`) | `product_orders` | Read: Buyer order history. Write: Checkout order placement. |
| **Order Items** | `orderItems` (`schema/orders/order-items/table.ts`) | `product_order_items` | Read: Line items. Write: Order placement line items. |
| **Order Addresses** | `orderAddresses` (`schema/orders/order-address.ts`) | `order_addresses` | Read: Order recipient info. Write: Snapshot shipping address. |
| **Order Status** | `orderStatusHistory` (`schema/orders/order-status-history/table.ts`) | `order_status_history` | Read: Tracking timeline. Write: Initial status log on purchase. |
| **Reviews** | `reviewsTable` (`schema/reviews/table.ts`) | `reviews` | Read: Product rating/comments. Write: Verified purchase review. |
| **Notifications** | `notifications` (`schema/notifications/notification-events.ts`) | `notifications` | Read: Buyer notifications (`recipientType = 'BUYER'`). Write: Mark read. |
| **Marketing / Promos**| `promotions` (`schema/marketing/promotion.ts`), `couponRedemptions` | `promotions`, `coupon_redemptions` | Read: Apply coupon codes. Write: Log redemption on checkout. |

---

## Client-Only Database Schemas (`packages/db/db/schema/client/*`)

| Table Name | Schema File | Purpose & Columns |
|---|---|---|
| `client_carts` | `cart.ts` | **Existing**. User cart container (`id`, `userId`, `createdAt`, `updatedAt`). |
| `client_cart_items` | `cart.ts` | **Existing**. Cart line item (`id`, `cartId`, `productId`, `quantity`, `size`, `color`). |
| `user_addresses` | `user-addresses.ts` | **Existing**. Buyer saved addresses (`id`, `userId`, `fullName`, `phone`, `addressLine1`, `city`, `state`, `postalCode`, `isDefault`). |
| `client_wishlists` | `wishlist.ts` | **Existing**. Buyer wishlist bookmarks (`id`, `userId`, `productId`, `createdAt`). |
| `client_hero_banners` | `hero-banners.ts` | **New**. Dynamic hero banners (`id`, `name`, `description`, `image`, `offer`, `slug`, `displayOrder`, `isActive`). |
| `client_search_history` | `search-history.ts` | **New**. Buyer search query history & suggestions (`id`, `userId`, `query`, `searchCount`, `lastSearchedAt`). |
| `client_recently_viewed` | `recently-viewed.ts` | **New**. Product browsing history for personalized recommendations (`id`, `userId`, `productId`, `viewedAt`). |
| `client_loyalty_accounts` | `loyalty.ts` | **New**. Buyer reward wallet balance and tier (`id`, `userId`, `pointsBalance`, `tier`, `updatedAt`). |

---

## Phased Implementation Roadmap

### Phase 1: Database Foundation & Client Schema Additions
- **Goal**: Register client-only tables and verify relations in `packages/db`.
- **Tasks**:
  1. Create `hero-banners.ts`, `search-history.ts`, `recently-viewed.ts`, and `loyalty.ts` in `packages/db/db/schema/client/`.
  2. Export all tables through `packages/db/db/schema/client/index.ts` and `packages/db/db/index.ts`.
  3. Execute Drizzle schema migration/push script for client tables only.
  4. Unit test: Verify table schemas compile and types export cleanly.

### Phase 2: Authentication, User Profile & Saved Addresses
- **Goal**: Full DB persistence for client login, sessions, profile settings, and shipping addresses.
- **Tasks**:
  1. Wire NextAuth credentials provider to verify against `usersTable` using bcrypt.
  2. Implement profile update service in `packages/client-packages/client-modules/account/services/user-service.ts` (`name`, `number`, `gender`, `imageUrl`).
  3. Connect `userAddressesTable` via `AddressRepository` and `AddressService` for full CRUD.
  4. Unit test: Address validation, default address switching, and profile queries.

### Phase 3: Catalog, Categories & Faceted Filtering
- **Goal**: Replace mock catalog data with live database queries against `productsTable`, `categoriesTable`, `pricingTable`, and `inventoryTable`.
- **Tasks**:
  1. Build `ProductRepository` in `packages/client-packages/client-modules/product/repositories/`:
     - Inner join `productsTable`, `productVariantsTable`, `pricingTable`, `inventoryTable`, `productImagesTable`, and `categoriesTable`.
     - Filter by category slug, subcategory, price range, and attributes.
  2. Implement `CategoryService` using `categoriesTable`, `categoryAttributesTable`, and `categoryAttributeOptionsTable` for dynamic filters.
  3. Build DTO transformer to output the exact shape required by storefront cards (`productData`, `productTagDes`, `sizes`, `modalImage`).
  4. Unit test: Category lookup, filter aggregation, and product listing pagination.

### Phase 4: Storefront Search, Dynamic Hero Banners & Recommendations
- **Goal**: Power homepage hero banners, search auto-complete, and recommendation carousels from the database.
- **Tasks**:
  1. Connect `/api/hero-items` to `clientHeroBannersTable`.
  2. Connect `/api/search` and `/api/search/suggestion` to `productsTable` (with `ilike` / full-text indexing) and `clientSearchHistoryTable`.
  3. Wire `/api/home-recommendation` to query top-selling products (via `orderItems` sales aggregation) and personalized picks (via `clientRecentlyViewedTable`).
  4. Unit test: Search query matching, hero banner ordering, and recommendation fallbacks.

### Phase 5: Persistent Cart & Wishlist with Guest Sync
- **Goal**: Seamless cart and wishlist management across guest sessions and authenticated states.
- **Tasks**:
  1. Connect `CartService` to `client_carts` and `client_cart_items`.
  2. Connect `WishlistService` to `client_wishlists` joined with product metadata.
  3. Wire `/api/wishlist/sync` and cart sync to merge localStorage guest items into the user's DB cart on login.
  4. Unit test: Add to cart, quantity update, stock threshold validation, and wishlist toggle.

### Phase 6: Checkout, Stripe Webhook & Atomic Order Creation
- **Goal**: Production-ready checkout workflow generating orders in shared `product_orders` and `product_order_items`.
- **Tasks**:
  1. In `/api/checkout`:
     - Validate items and prices against `pricingTable` and stock against `inventoryTable`.
     - Validate coupon against `promotions` table.
     - Generate Stripe Checkout session with metadata (`userId`, `addressId`, `couponCode`).
  2. In `/api/stripe-webhook`:
     - On `checkout.session.completed`, execute an atomic database transaction:
       - Insert into `orders` (`product_orders`).
       - Insert into `orderAddresses` (`order_addresses`) snapshotting buyer's address.
       - Insert into `orderItems` (`product_order_items`) with unitPrice snapshot.
       - Insert into `orderStatusHistory` (`order_status_history`).
       - Decrement quantity in `inventoryTable`.
       - Record coupon redemption in `couponRedemptions` if coupon was used.
       - Clear user's `client_cart_items`.
  3. Unit test: Transaction atomicity, stock decrement, and webhook signature verification.

### Phase 7: Buyer Order History & Shipment Tracking
- **Goal**: Give buyers full visibility into their orders, delivery status, and invoice breakdown.
- **Tasks**:
  1. Update `/api/orders` to query `orders` where `buyerId = session.user.id`, joined with `orderItems` and `orderAddresses`.
  2. Update `/api/orders/[id]` to return comprehensive tracking timeline from `orderStatusHistory` and shipment details from `orderShipments`.
  3. Implement buyer order cancellation for `PENDING` / `CONFIRMED` orders.
  4. Unit test: Buyer ownership check (prevent cross-user order access) and order transformation.

### Phase 8: Verified Buyer Product Reviews & Ratings
- **Goal**: Enable verified customers to review products and display live ratings on product pages.
- **Tasks**:
  1. In `/api/orders/review`:
     - Check `product_order_items` to ensure buyer has purchased the item and order is `DELIVERED`.
     - Insert review into `reviewsTable` (`buyerId`, `productId`, `sellerId`, `rating`, `reviewTitle`, `reviewContent`, `isVerifiedPurchase: true`).
  2. In `/api/products/[productId]`:
     - Compute real-time rating average and review distribution from `reviewsTable`.
  3. Unit test: Verified purchase enforcement and rating calculation.

### Phase 9: In-App Notifications & Buyer Rewards
- **Goal**: Live notification feed and loyalty points management.
- **Tasks**:
  1. In `/api/notification`:
     - Query `notifications` table where `recipientType = 'BUYER'` and `recipientId = session.user.id`.
     - Implement `/api/notification/mark-all` to update `isRead = true`.
  2. In `/api/rewards`:
     - Query `clientLoyaltyAccountsTable` and active promotions from `promotions` where `promotionType IN ('COUPON', 'LOYALTY', 'FIRST_ORDER')`.
  3. Unit test: Notification filtering and reward points ledger calculation.

### Phase 10: Seeding, Automated Test Suite & Validation
- **Goal**: Populate initial client store data and verify zero regressions.
- **Tasks**:
  1. Build `seed-client-data.ts` to populate sample hero banners, store categories, client cart test items, and review records.
  2. Run full test suite covering all client services and API routes.
  3. Verify that `apps/seller` and `packages/modules` remain 100% untouched via git status.
