import {
  pgTable,
  uuid,
  varchar,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";

// Per-seller delivery configuration (local radius, charges, pickup hub).
// Replaces the previous module-level in-memory settings object, which was
// global across all sellers and lost on every restart.
export const sellerDeliverySettings = pgTable("seller_delivery_settings", {
  sellerId: uuid("seller_id")
    .primaryKey()
    .references(() => seller.id, { onDelete: "cascade" }),

  maxRadiusKm: numeric("max_radius_km", { precision: 6, scale: 2 })
    .notNull()
    .default("15"),
  baseCharge: numeric("base_charge", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  freeShippingThreshold: numeric("free_shipping_threshold", {
    precision: 10,
    scale: 2,
  })
    .notNull()
    .default("0"),

  hubName: varchar("hub_name", { length: 200 }),
  hubAddress: varchar("hub_address", { length: 500 }),
  hubCity: varchar("hub_city", { length: 150 }),
  hubPincode: varchar("hub_pincode", { length: 20 }),
  hubPhone: varchar("hub_phone", { length: 30 }),
  operatingHours: varchar("operating_hours", { length: 200 }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const sellerShippingZones = pgTable("seller_shipping_zones", {
  id: uuid("id").defaultRandom().primaryKey(),

  sellerId: uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "cascade" }),

  zoneName: varchar("zone_name", { length: 150 }).notNull(),
  partnerCode: varchar("partner_code", { length: 50 }),
  flatRateFee: numeric("flat_rate_fee", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  estimatedDays: varchar("estimated_days", { length: 50 }),
  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
