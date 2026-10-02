import {
  pgTable,
  uuid,
  varchar,
  boolean,
  smallint,
  timestamp,
} from "drizzle-orm/pg-core";

// Shipping Partners Table
export const shippingPartners = pgTable("shipping_partners", {
  id: uuid("id").defaultRandom().primaryKey(),

  partnerCode: varchar("partner_code", { length: 50 }).notNull(),
  partnerName: varchar("partner_name", { length: 150 }).notNull(),

  websiteUrl: varchar("website_url", { length: 255 }),
  trackingUrlTemplate: varchar("tracking_url_template", { length: 500 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 30 }),

  supportsCod: boolean("supports_cod").notNull().default(false),
  supportsPickup: boolean("supports_pickup").notNull().default(true),
  supportsReturn: boolean("supports_return").notNull().default(true),

  isActive: boolean("is_active").notNull().default(true),
  displayOrder: smallint("display_order").notNull().default(1),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
