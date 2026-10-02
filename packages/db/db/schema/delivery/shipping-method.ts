import {
  pgTable,
  uuid,
  varchar,
  text,
  smallint,
  boolean,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { shippingPartners } from "./shipping-partners";

export const shippingMethods = pgTable("shipping_methods", {
  id: uuid("id").defaultRandom().primaryKey(),

  partnerId: uuid("partner_id")
    .notNull()
    .references(() => shippingPartners.id, { onDelete: "restrict" }),

  methodCode: varchar("method_code", { length: 50 }).notNull(),
  methodName: varchar("method_name", { length: 100 }).notNull(),
  description: text("description"),

  estimatedMinDays: smallint("estimated_min_days").notNull().default(1),
  estimatedMaxDays: smallint("estimated_max_days").notNull().default(3),

  maxWeightKg: numeric("max_weight_kg", { precision: 8, scale: 2 }),

  supportsCod: boolean("supports_cod").notNull().default(false),
  supportsPickup: boolean("supports_pickup").notNull().default(true),
  supportsReturn: boolean("supports_return").notNull().default(true),

  isDefault: boolean("is_default").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),

  displayOrder: smallint("display_order").notNull().default(1),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
