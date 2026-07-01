import {
  pgTable,
  uuid,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { returnRequests } from "./return-request";
import { product_orders } from "../orders/orders";
import { usersTable } from "../users";
import { seller } from "../seller";
import { orderItems } from "../order-items";
import { productVariants } from "../products/product_variants";
import { shipmentOrders } from "../delivery/shipping-orders";
import { products } from "../products/products";

// Enums
export const exchangeStatusEnum = pgEnum("exchange_status", [
  "REQUESTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "WAITING_FOR_RETURN",
  "INVENTORY_RESERVED",
  "READY_TO_SHIP",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "WAITLISTED",
  "BACKORDERED",
]);

export const exchangeReasonEnum = pgEnum("exchange_reason", [
  "SIZE_CHANGE",
  "COLOR_CHANGE",
  "WRONG_ITEM",
  "DEFECTIVE",
  "DAMAGED",
  "QUALITY_ISSUE",
  "OTHER",
]);

export const exchangeRequests = pgTable("exchange_requests", {
  id: uuid("id").defaultRandom().primaryKey(),

  returnRequestId: uuid("return_request_id")
    .notNull()
    .references(() => returnRequests.id, { onDelete: "restrict" }),

  orderId: uuid("order_id")
    .notNull()
    .references(() => product_orders.id, { onDelete: "restrict" }),

  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "restrict" }),

  sellerId: uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "restrict" }),

  originalOrderItemId: uuid("original_order_item_id")
    .notNull()
    .references(() => orderItems.id, { onDelete: "restrict" }),

  replacementProductId: uuid("replacement_product_id")
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),

  replacementVariantId: uuid("replacement_variant_id").references(
    () => productVariants.id,
    { onDelete: "set null" },
  ),

  replacementQuantity: integer("replacement_quantity").notNull().default(1),

  replacementShipmentId: uuid("replacement_shipment_id").references(
    () => shipmentOrders.id,
    { onDelete: "set null" },
  ),

  status: exchangeStatusEnum("status").notNull().default("REQUESTED"),
  exchangeReason: exchangeReasonEnum("exchange_reason").notNull(),

  inventoryReserved: boolean("inventory_reserved").notNull().default(false),
  inventoryReservedAt: timestamp("inventory_reserved_at", {
    withTimezone: true,
  }),

  completedAt: timestamp("completed_at", { withTimezone: true }),
  notes: text("notes"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
