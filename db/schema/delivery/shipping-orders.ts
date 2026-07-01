import {
  pgTable,
  uuid,
  varchar,
  text,
  smallint,
  numeric,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";
import { usersTable } from "../users";
import { product_orders } from "../orders/orders";
import { shippingPartners } from "./shipping-partners";
import { shippingMethods } from "./shipping-method";

// Enums
export const shipmentStatusEnum = pgEnum("shipment_status", [
  "PENDING",
  "READY_FOR_PICKUP",
  "PICKUP_SCHEDULED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED_DELIVERY",
  "RETURN_INITIATED",
  "RETURNED",
  "CANCELLED",
  "LOST",
  "DAMAGED",
  "RTO",
]);

export const shipmentOrders = pgTable("shipment_orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
    .notNull()
    .references(() => product_orders.id, { onDelete: "restrict" }),

  sellerId: uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "restrict" }),

  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "restrict" }),

  shippingPartnerId: uuid("shipping_partner_id")
    .notNull()
    .references(() => shippingPartners.id, { onDelete: "restrict" }),

  shippingMethodId: uuid("shipping_method_id")
    .notNull()
    .references(() => shippingMethods.id, { onDelete: "restrict" }),

  shipmentNumber: varchar("shipment_number", { length: 100 }).notNull(),
  awbNumber: varchar("awb_number", { length: 150 }),
  trackingNumber: varchar("tracking_number", { length: 150 }),

  status: shipmentStatusEnum("status").notNull().default("PENDING"),

  pickupScheduledAt: timestamp("pickup_scheduled_at", { withTimezone: true }),
  pickedUpAt: timestamp("picked_up_at", { withTimezone: true }),
  shippedAt: timestamp("shipped_at", { withTimezone: true }),
  estimatedDeliveryAt: timestamp("estimated_delivery_at", {
    withTimezone: true,
  }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),

  deliveryAttempts: smallint("delivery_attempts").notNull().default(0),

  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  codAmount: numeric("cod_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),

  notes: text("notes"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
