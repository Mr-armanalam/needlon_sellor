import {
  pgTable,
  uuid,
  integer,
  numeric,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { returnRequests } from "./return-request";
import { orderItems } from "../order-items";
import { products } from "../products/products";
import { productVariants } from "../products/product_variants";

// Enums
export const inspectionStatusEnum = pgEnum("inspection_status", [
  "PENDING",
  "RECEIVED",
  "PASSED",
  "FAILED",
  "PARTIALLY_APPROVED",
  "REJECTED",
  "DAMAGED_IN_TRANSIT",
  "MISSING_ACCESSORIES",
]);

// Reuse return_reason enum from return_requests
export const returnItems = pgTable("return_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  returnRequestId: uuid("return_request_id")
    .notNull()
    .references(() => returnRequests.id, { onDelete: "restrict" }),

  orderItemId: uuid("order_item_id")
    .notNull()
    .references(() => orderItems.id, { onDelete: "restrict" }),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),

  variantId: uuid("variant_id").references(() => productVariants.id, {
    onDelete: "set null",
  }),

  orderedQuantity: integer("ordered_quantity").notNull(),
  requestedQuantity: integer("requested_quantity").notNull(),
  approvedQuantity: integer("approved_quantity").notNull().default(0),
  receivedQuantity: integer("received_quantity").notNull().default(0),

  unitPriceSnapshot: numeric("unit_price_snapshot", {
    precision: 10,
    scale: 2,
  }).notNull(),
  refundAmount: numeric("refund_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),

  returnReason: varchar("return_reason", { length: 50 }).notNull(), // reuse enum values
  inspectionStatus: inspectionStatusEnum("inspection_status")
    .notNull()
    .default("PENDING"),
  inspectionNotes: text("inspection_notes"),

  restockable: boolean("restockable").notNull().default(false),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
