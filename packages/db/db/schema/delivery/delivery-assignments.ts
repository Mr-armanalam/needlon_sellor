import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";
import { orders } from "../orders/table";
import { shipmentOrders } from "./shipping-orders";
import { deliveryExecutives } from "./delivery-executives";

// One row per (shipment -> executive) assignment event. Reassignment closes
// the previous row (status REASSIGNED) and inserts a new one, so the full
// assignment history of a shipment is preserved. The shipment's current
// executive is denormalised onto shipment_orders.executive_id.
export const deliveryAssignmentStatusEnum = pgEnum("delivery_assignment_status", [
  "ASSIGNED",
  "ACCEPTED",
  "PICKED_UP",
  "DELIVERED",
  "FAILED",
  "REASSIGNED",
  "CANCELLED",
]);

export const deliveryAssignments = pgTable("delivery_assignments", {
  id: uuid("id").defaultRandom().primaryKey(),

  shipmentId: uuid("shipment_id")
    .notNull()
    .references(() => shipmentOrders.id, { onDelete: "cascade" }),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  executiveId: uuid("executive_id")
    .notNull()
    .references(() => deliveryExecutives.id, { onDelete: "restrict" }),
  // The seller (or admin) who made the assignment.
  assignedBy: uuid("assigned_by")
    .notNull()
    .references(() => seller.id, { onDelete: "restrict" }),

  status: deliveryAssignmentStatusEnum("status").notNull().default("ASSIGNED"),

  assignedAt: timestamp("assigned_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  pickedUpAt: timestamp("picked_up_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  failureReason: text("failure_reason"),
  notes: text("notes"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
