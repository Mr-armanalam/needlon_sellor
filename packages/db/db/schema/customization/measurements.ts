import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { usersTable } from "../users";
import { seller } from "../seller";
import { orders } from "../orders/table";
import { orderItems } from "../orders/order-items/table";
import { productsTable } from "../catalog/products/table";

export const customerMeasurementsTable = pgTable(
  "customer_measurements",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // User / Buyer link (nullable for in-shop walk-in guest measurements)
    userId: uuid("user_id").references(() => usersTable.id, { onDelete: "set null" }),

    // Tailor shop / Seller reference
    sellerId: uuid("seller_id").references(() => seller.id, { onDelete: "cascade" }),

    // Order item association (when linked to an active purchase)
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
    orderItemId: uuid("order_item_id").references(() => orderItems.id, { onDelete: "set null" }),
    productId: uuid("product_id").references(() => productsTable.id, { onDelete: "set null" }),

    // Customer Identity Info
    customerName: varchar("customer_name", { length: 150 }),
    customerPhone: varchar("customer_phone", { length: 25 }),
    customerEmail: varchar("customer_email", { length: 150 }),

    // Bespoke Taxonomy
    gender: varchar("gender", { length: 20 }).notNull(), // 'menswear' | 'womenswear'
    garmentType: varchar("garment_type", { length: 50 }).notNull(), // e.g. 'shirt', 'pant', 'lehenga'
    measurementUnit: varchar("measurement_unit", { length: 10 }).notNull().default("INCHES"), // 'INCHES' | 'CM'

    // Structured JSON Measurements
    // Stores key-value metrics like: { "chest_circumference": 40.5, "sleeve_length": 32 }
    essentialMeasurements: jsonb("essential_measurements").notNull().default({}),

    // Stores posture & posture nuances: { "shoulder_slope": "SLOPING", "scye_depth": 9.5 }
    postureSpecifics: jsonb("posture_specifics").notNull().default({}),

    // Fit silhouette & instructions
    fitPreference: varchar("fit_preference", { length: 30 }).default("REGULAR"), // 'SLIM' | 'REGULAR' | 'COMFORT'
    tailorNotes: text("tailor_notes"),

    // Channel metadata
    source: varchar("source", { length: 30 }).notNull().default("ONLINE_CUSTOMER"), // 'ONLINE_CUSTOMER' | 'IN_STORE_TAILOR_MASTER'
    status: varchar("status", { length: 30 }).notNull().default("SUBMITTED"), // 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'IN_CUTTING' | 'COMPLETED'

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("customer_measurements_user_idx").on(table.userId),
    index("customer_measurements_seller_idx").on(table.sellerId),
    index("customer_measurements_order_idx").on(table.orderId),
    index("customer_measurements_garment_idx").on(table.gender, table.garmentType),
  ]
);

export type CustomerMeasurementRecord = typeof customerMeasurementsTable.$inferSelect;
export type NewCustomerMeasurementRecord = typeof customerMeasurementsTable.$inferInsert;
