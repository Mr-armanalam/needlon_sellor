import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";

// Enums
export const promotionTypeEnum = pgEnum("promotion_type", [
  "COUPON",
  "AUTOMATIC",
  "FLASH_SALE",
  "FREE_DELIVERY",
  "BUY_X_GET_Y",
  "LOYALTY",
  "FIRST_ORDER",
  "FESTIVAL",
]);

export const discountTypeEnum = pgEnum("discount_type", [
  "PERCENTAGE",
  "FIXED_AMOUNT",
]);

export const promotionStatusEnum = pgEnum("promotion_status", [
  "DRAFT",
  "SCHEDULED",
  "ACTIVE",
  "PAUSED",
  "EXPIRED",
  "CANCELLED",
]);

export const promotions = pgTable(
  "promotions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    sellerId: uuid("seller_id")
      .notNull()
      .references(() => seller.id, { onDelete: "restrict" }),

    name: varchar("name", { length: 150 }).notNull(),
    description: text("description"),

    promotionType: promotionTypeEnum("promotion_type").notNull(),

    couponCode: varchar("coupon_code", { length: 50 }),

    discountType: discountTypeEnum("discount_type").notNull(),
    discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),

    minimumOrderAmount: numeric("minimum_order_amount", { precision: 10, scale: 2 }),
    maximumDiscountAmount: numeric("maximum_discount_amount", { precision: 10, scale: 2 }),

    usageLimit: integer("usage_limit"),
    usagePerBuyer: integer("usage_per_buyer").notNull().default(1),

    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),

    status: promotionStatusEnum("status").notNull().default("DRAFT"),

    totalRedemptions: integer("total_redemptions").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }), // soft delete
  },
  (table) => [
    index("promotions_seller_idx").on(table.sellerId),
    index("promotions_status_idx").on(table.status),
    index("promotions_coupon_idx").on(table.couponCode),
    index("promotions_schedule_idx").on(table.startsAt, table.endsAt),
  ],
);
