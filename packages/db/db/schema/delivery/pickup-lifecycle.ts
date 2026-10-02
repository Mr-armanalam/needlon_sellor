import {
  pgTable,
  uuid,
  varchar,
  text,
  smallint,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";
import { shipmentOrders } from "./shipping-orders";
import { shippingPartners } from "./shipping-partners";
import { orderAddresses } from "../orders/order-address";

// Enums
export const pickupStatusEnum = pgEnum("pickup_status", [
  "REQUESTED",
  "SCHEDULED",
  "COURIER_ASSIGNED",
  "OUT_FOR_PICKUP",
  "PICKED_UP",
  "FAILED",
  "RESCHEDULED",
  "CANCELLED",
  "ON_HOLD",
  "EXPIRED",
]);

export const pickupRequests = pgTable("pickup_requests", {
  id: uuid("id").defaultRandom().primaryKey(),

  shipmentId: uuid("shipment_id")
    .notNull()
    .references(() => shipmentOrders.id, { onDelete: "restrict" }),

  sellerId: uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "restrict" }),

  shippingPartnerId: uuid("shipping_partner_id")
    .notNull()
    .references(() => shippingPartners.id, { onDelete: "restrict" }),

  pickupReference: varchar("pickup_reference", { length: 100 }).notNull(),
  partnerPickupId: varchar("partner_pickup_id", { length: 255 }),

  status: pickupStatusEnum("status").notNull().default("REQUESTED"),

  pickupAddressId: uuid("pickup_address_id")
    .notNull()
    .references(() => orderAddresses.id, { onDelete: "restrict" }),

  requestedDate: timestamp("requested_date").notNull(),
  pickupWindowStart: timestamp("pickup_window_start", { withTimezone: true }),
  pickupWindowEnd: timestamp("pickup_window_end", { withTimezone: true }),

  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  pickedUpAt: timestamp("picked_up_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  cancellationReason: text("cancellation_reason"),

  attemptCount: smallint("attempt_count").notNull().default(0),
  notes: text("notes"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
