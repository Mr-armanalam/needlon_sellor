// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-items/types.ts
// Description: Shared Order Item module types
// Phase: 6.2.3
// ============================================================================

import type {
  orderItemDiscountTypeEnum,
  orderItemFulfillmentTypeEnum,
  orderItemSnapshotSourceEnum,
  orderItemStatusEnum,
  orderItemTaxTypeEnum,
} from "./constants";

/* ============================================================================
 * Enum Types
 * ========================================================================== */

export type OrderItemStatus =
  (typeof orderItemStatusEnum.enumValues)[number];

export type OrderItemDiscountType =
  (typeof orderItemDiscountTypeEnum.enumValues)[number];

export type OrderItemTaxType =
  (typeof orderItemTaxTypeEnum.enumValues)[number];

export type OrderItemFulfillmentType =
  (typeof orderItemFulfillmentTypeEnum.enumValues)[number];

export type OrderItemSnapshotSource =
  (typeof orderItemSnapshotSourceEnum.enumValues)[number];

/* ============================================================================
 * Identity
 * ========================================================================== */

export interface OrderItemIdentity {
  id: string;

  orderId: string;

  sellerId: string;

  productId: string;

  variantId: string | null;
}

/* ============================================================================
 * Product Snapshot
 * ========================================================================== */

export interface OrderItemProductSnapshot {
  sku: string;

  variantSku: string | null;

  productSlug: string;

  productName: string;

  variantName: string | null;

  brandName: string | null;

  categoryName: string | null;

  thumbnailUrl: string | null;

  imageUrl: string | null;

  snapshotSource: OrderItemSnapshotSource;
}

/* ============================================================================
 * Pricing Snapshot
 * ========================================================================== */

export interface OrderItemPricing {
  currency: string;

  unitPrice: string;

  compareAtPrice: string | null;

  discountType: OrderItemDiscountType;

  discountAmount: string;

  taxType: OrderItemTaxType;

  taxRate: string;

  taxAmount: string;

  subtotal: string;

  total: string;
}

/* ============================================================================
 * Quantity
 * ========================================================================== */

export interface OrderItemQuantity {
  quantity: number;
}

/* ============================================================================
 * Physical Snapshot
 * ========================================================================== */

export interface OrderItemDimensions {
  weight: string | null;

  length: string | null;

  width: string | null;

  height: string | null;
}

/* ============================================================================
 * Inventory Snapshot
 * ========================================================================== */

export interface OrderItemInventorySnapshot {
  inventoryLocation: string | null;

  warehouseName: string | null;
}

/* ============================================================================
 * Fulfillment
 * ========================================================================== */

export interface OrderItemFulfillment {
  fulfillmentType: OrderItemFulfillmentType;

  itemStatus: OrderItemStatus;
}

/* ============================================================================
 * Seller Information
 * ========================================================================== */

export interface OrderItemSellerData {
  sellerSku: string | null;

  notes: string | null;
}

/* ============================================================================
 * Audit
 * ========================================================================== */

export interface OrderItemAudit {
  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}

/* ============================================================================
 * Aggregate
 * ========================================================================== */

export interface OrderItem
  extends OrderItemIdentity,
    OrderItemProductSnapshot,
    OrderItemPricing,
    OrderItemQuantity,
    OrderItemDimensions,
    OrderItemInventorySnapshot,
    OrderItemFulfillment,
    OrderItemSellerData,
    OrderItemAudit {}

/* ============================================================================
 * DTOs
 * ========================================================================== */

export interface CreateOrderItemInput {
  orderId: string;

  sellerId: string;

  productId: string;

  variantId?: string | null;

  quantity: number;
}

export interface UpdateOrderItemInput {
  itemStatus?: OrderItemStatus;

  fulfillmentType?: OrderItemFulfillmentType;

  sellerSku?: string | null;

  notes?: string | null;
}

/* ============================================================================
 * Pricing Summary
 * ========================================================================== */

export interface OrderItemPricingSummary {
  quantity: number;

  unitPrice: string;

  subtotal: string;

  discountAmount: string;

  taxAmount: string;

  total: string;
}

/* ============================================================================
 * Product Summary
 * ========================================================================== */

export interface OrderItemProductSummary {
  productName: string;

  variantName: string | null;

  sku: string;

  thumbnailUrl: string | null;
}

/* ============================================================================
 * List Item
 * ========================================================================== */

export interface OrderItemListItem {
  id: string;

  orderId: string;

  productName: string;

  variantName: string | null;

  quantity: number;

  total: string;

  itemStatus: OrderItemStatus;

  createdAt: Date;
}

/* ============================================================================
 * Search & Filters
 * ========================================================================== */

export interface OrderItemSearchFilter {
  search?: string;

  orderId?: string;

  sellerId?: string;

  productId?: string;

  variantId?: string;

  itemStatus?: OrderItemStatus;

  fulfillmentType?: OrderItemFulfillmentType;

  fromDate?: Date;

  toDate?: Date;

  page?: number;

  limit?: number;
}