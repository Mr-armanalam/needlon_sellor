import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  numeric,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";

// Enums
export const addressTypeEnum = pgEnum("address_type", [
  "PICKUP",
  "WAREHOUSE",
  "RETURN",
  "BILLING",
  "REGISTERED_OFFICE",
  "CORPORATE_OFFICE",
  "SHOWROOM",
  "FULFILLMENT_CENTER",
  "DROPSHIP_LOCATION",
]);

export const sellerAddresses = pgTable("seller_addresses", {
  id: uuid("id").defaultRandom().primaryKey(),

  sellerId: uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "restrict" }),

  label: varchar("label", { length: 100 }).notNull(),
  addressType: addressTypeEnum("address_type").notNull(),

  contactPerson: varchar("contact_person", { length: 150 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  companyName: varchar("company_name", { length: 200 }),

  addressLine1: varchar("address_line_1", { length: 255 }).notNull(),
  addressLine2: varchar("address_line_2", { length: 255 }),
  landmark: varchar("landmark", { length: 150 }),

  city: varchar("city", { length: 120 }).notNull(),
  district: varchar("district", { length: 120 }),
  state: varchar("state", { length: 120 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  countryCode: varchar("country_code", { length: 2 }).notNull().default("IN"),

  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),

  isDefault: boolean("is_default").notNull().default(false),
  isVerified: boolean("is_verified").notNull().default(false),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),

  isActive: boolean("is_active").notNull().default(true),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
