// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-items/relations.ts
// Description: Order Item relations
// Phase: 6.2.5
// ============================================================================

import { relations } from "drizzle-orm";

import { orderItems } from "./table";

import { orders } from "../table";

import { seller } from "@/db/schema/seller";
import { productsTable } from "@/db/schema/catalog/products";
import { productVariantsTable } from "@/db/schema/catalog/products/product-variants";

import { orderReturns } from "@/db/schema/orders/order-returns/table";

/**
 * ============================================================================
 * Order Item Relations
 * ============================================================================
 *
 * Parent
 *
 * orders
 *      │
 *      ▼
 * order_items
 *
 * Child
 *
 * order_returns
 *
 * ============================================================================
 *
 * Every Order Item represents an immutable snapshot of a purchased SKU.
 *
 * Returns are processed at the item level instead of the order level.
 *
 * ============================================================================
 */

export const orderItemsRelations = relations(
  orderItems,
  ({ one, many }) => ({
    /**
     * ------------------------------------------------------------------------
     * Parent Order
     * ------------------------------------------------------------------------
     */

    order: one(orders, {
      fields: [orderItems.orderId],
      references: [orders.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Seller
     * ------------------------------------------------------------------------
     */

    seller: one(seller, {
      fields: [orderItems.sellerId],
      references: [seller.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Product
     * ------------------------------------------------------------------------
     *
     * Original catalog product.
     *
     * Snapshot data remains inside order_items.
     */

    product: one(productsTable, {
      fields: [orderItems.productId],
      references: [productsTable.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Product Variant
     * ------------------------------------------------------------------------
     *
     * Nullable because simple products may not
     * contain variants.
     */

    variant: one(productVariantsTable, {
      fields: [orderItems.variantId],
      references: [productVariantsTable.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Returns
     * ------------------------------------------------------------------------
     *
     * One item may have multiple return records.
     *
     * Examples
     *
     * • Return Request
     * • Rejected Return
     * • Approved Return
     * • Replacement
     * • Partial Refund
     */

    returns: many(orderReturns),
  }),
);