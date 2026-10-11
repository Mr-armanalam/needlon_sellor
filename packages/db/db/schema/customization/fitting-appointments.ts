import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { usersTable } from "../users";
import { seller } from "../seller";
import { orders } from "../orders/table";

export const fittingAppointmentsTable = pgTable(
  "fitting_appointments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Order reference
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    // Tailor shop atelier
    sellerId: uuid("seller_id")
      .notNull()
      .references(() => seller.id, { onDelete: "cascade" }),

    // Customer reference
    customerId: uuid("customer_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    // Schedule details
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
    durationMinutes: integer("duration_minutes").notNull().default(30),

    // Status: SCHEDULED | COMPLETED | RESCHEDULED | CANCELLED
    status: varchar("status", { length: 30 }).notNull().default("SCHEDULED"),

    // Fitting specifics & alterations
    fittingNotes: text("fitting_notes"),
    alterationsRequired: boolean("alterations_required").notNull().default(false),
    alterationDetails: text("alteration_details"),

    // Master tailor who conducted the session
    tailorMasterName: varchar("tailor_master_name", { length: 150 }),

    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("fitting_appointments_order_idx").on(table.orderId),
    index("fitting_appointments_seller_idx").on(table.sellerId),
    index("fitting_appointments_customer_idx").on(table.customerId),
    index("fitting_appointments_scheduled_idx").on(table.scheduledAt),
  ]
);

export type FittingAppointmentRecord = typeof fittingAppointmentsTable.$inferSelect;
export type NewFittingAppointmentRecord = typeof fittingAppointmentsTable.$inferInsert;
