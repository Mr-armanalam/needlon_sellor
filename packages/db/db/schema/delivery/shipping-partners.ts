import {
  pgTable,
  uuid,
  varchar,
  boolean,
  smallint,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// How a partner is integrated with the platform:
// - AGGREGATOR_API: booked through an aggregator API (e.g. Shiprocket)
// - DIRECT_API: booked through the carrier's own API
// - MANUAL: seller books outside the platform and records the real AWB here
// - INHOUSE: the platform's own delivery-executive fleet fulfils the shipment
export const partnerIntegrationTypeEnum = pgEnum("partner_integration_type", [
  "AGGREGATOR_API",
  "DIRECT_API",
  "MANUAL",
  "INHOUSE",
]);

// Shipping Partners Table
export const shippingPartners = pgTable("shipping_partners", {
  id: uuid("id").defaultRandom().primaryKey(),

  partnerCode: varchar("partner_code", { length: 50 }).notNull().unique(),
  partnerName: varchar("partner_name", { length: 150 }).notNull(),

  integrationType: partnerIntegrationTypeEnum("integration_type")
    .notNull()
    .default("MANUAL"),
  apiBaseUrl: varchar("api_base_url", { length: 500 }),

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
