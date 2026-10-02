import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { shipmentOrders } from "./shipping-orders";

// Enums
export const trackingStatusEnum = pgEnum("tracking_status", [
  "SHIPMENT_CREATED",
  "PICKUP_SCHEDULED",
  "PICKED_UP",
  "ARRIVED_AT_HUB",
  "DEPARTED_HUB",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERY_ATTEMPTED",
  "DELIVERED",
  "RETURN_INITIATED",
  "RETURNED_TO_ORIGIN",
  "RETURNED",
  "CANCELLED",
  "DELAYED",
  "LOST",
  "DAMAGED",
]);

export const shipmentTrackingEvents = pgTable("shipment_tracking_events", {
  id: uuid("id").defaultRandom().primaryKey(),

  shipmentId: uuid("shipment_id")
    .notNull()
    .references(() => shipmentOrders.id, { onDelete: "restrict" }),

  trackingStatus: trackingStatusEnum("tracking_status").notNull(),
  eventCode: varchar("event_code", { length: 100 }),
  eventDescription: text("event_description").notNull(),

  locationName: varchar("location_name", { length: 255 }),
  city: varchar("city", { length: 150 }),
  state: varchar("state", { length: 150 }),
  country: varchar("country", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }),

  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),

  rawPayload: jsonb("raw_payload"),

  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
