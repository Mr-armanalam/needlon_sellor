import {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "../users";
import { product_orders } from "../orders/orders";
import { promotions } from "./promotion";

// Enums
export const redemptionStatusEnum = pgEnum("redemption_status", [
  "SUCCESS",
  "FAILED",
  "CANCELLED",
  "ROLLED_BACK",
]);

export const couponRedemptions = pgTable("coupon_redemptions", {
  id: uuid("id").defaultRandom().primaryKey(),

  promotionId: uuid("promotion_id")
    .notNull()
    .references(() => promotions.id, { onDelete: "restrict" }),

  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "restrict" }),

  orderId: uuid("order_id").references(() => product_orders.id, {
    onDelete: "set null",
  }),

  status: redemptionStatusEnum("status").notNull().default("SUCCESS"),

  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),

  orderSubtotal: numeric("order_subtotal", { precision: 10, scale: 2 }).notNull(),

  failureReason: varchar("failure_reason", { length: 255 }),
  buyerIpHash: varchar("buyer_ip_hash", { length: 64 }),

  redeemedAt: timestamp("redeemed_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
