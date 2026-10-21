import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";

// Delivery executives are real platform people: onboarded and managed by
// admins (created_by -> the admin's seller row), assigned to shipments via
// delivery_assignments, and able to authenticate to see their deliveries.
// This replaces the old practice of stuffing a free-text name/phone into
// shipment_orders.notes as JSON.
export const deliveryExecutiveStatusEnum = pgEnum("delivery_executive_status", [
  "PENDING_VERIFICATION",
  "ACTIVE",
  "SUSPENDED",
  "INACTIVE",
]);

export const deliveryExecutives = pgTable("delivery_executives", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  // Nullable until the executive sets a password / first OTP login.
  passwordHash: varchar("password_hash", { length: 255 }),

  vehicleType: varchar("vehicle_type", { length: 50 }),
  vehicleNumber: varchar("vehicle_number", { length: 30 }),
  licenseNumber: varchar("license_number", { length: 50 }),

  addressLine: text("address_line"),
  city: varchar("city", { length: 150 }),
  state: varchar("state", { length: 150 }),
  pincode: varchar("pincode", { length: 20 }),

  status: deliveryExecutiveStatusEnum("status")
    .notNull()
    .default("PENDING_VERIFICATION"),
  isAvailable: boolean("is_available").notNull().default(true),

  // The admin (seller row with role "admin") who onboarded this executive.
  createdBy: uuid("created_by").references(() => seller.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
