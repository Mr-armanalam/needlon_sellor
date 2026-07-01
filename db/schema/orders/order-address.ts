import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { product_orders } from "./orders"; // Importing your custom table name reference

// Address Type Enum for future-proofing checkout workflows
export const addressTypeEnum = pgEnum("order_address_type", [
  "DELIVERY",
  "BILLING",
]);

export const orderAddresses = pgTable(
  "order_addresses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .references(() => product_orders.id, { onDelete: "cascade" })
      .notNull(),

    addressType: addressTypeEnum("address_type").default("DELIVERY").notNull(),

    // Recipient Snapshot Identity
    recipientName: varchar("recipient_name", { length: 150 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }).notNull(),

    // Structural Breakdown
    addressLine1: varchar("address_line_1", { length: 255 }).notNull(),
    addressLine2: varchar("address_line_2", { length: 255 }),
    landmark: varchar("landmark", { length: 255 }),
    city: varchar("city", { length: 100 }).notNull(),
    district: varchar("district", { length: 100 }),
    state: varchar("state", { length: 100 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }).notNull(),
    country: varchar("country", { length: 100 }).default("India").notNull(),

    // Optional Geolocation Parameters (Numeric avoids rounding floats)
    latitude: numeric("latitude", { precision: 10, scale: 7 }),
    longitude: numeric("longitude", { precision: 10, scale: 7 }),

    deliveryNotes: text("delivery_notes"),

    // Immutable Audit Record (No updated_at column to ensure history is locked)
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      addressOrderLookupIdx: index("order_addresses_order_idx").on(
        table.orderId,
      ),
    };
  },
);
