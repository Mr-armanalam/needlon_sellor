import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { seller } from "../seller";
import { sellerSubscriptions } from "./seller-subscription";
import { subscriptionPayments } from "./subscription-payment";

// Enums
export const invoiceStatusEnum = pgEnum("invoice_status", [
  "DRAFT",
  "ISSUED",
  "PAID",
  "CANCELLED",
  "VOID",
]);

export const subscriptionInvoices = pgTable("subscription_invoices", {
  id: uuid("id").defaultRandom().primaryKey(),

  invoiceNumber: varchar("invoice_number", { length: 100 }).notNull(),

  sellerId: uuid("seller_id")
    .notNull()
    .references(() => seller.id, { onDelete: "restrict" }),

  subscriptionId: uuid("subscription_id")
    .notNull()
    .references(() => sellerSubscriptions.id, { onDelete: "restrict" }),

  paymentId: uuid("payment_id").references(() => subscriptionPayments.id, {
    onDelete: "set null",
  }),

  planNameSnapshot: varchar("plan_name_snapshot", { length: 100 }).notNull(),

  billingPeriodStart: timestamp("billing_period_start", {
    withTimezone: true,
  }).notNull(),
  billingPeriodEnd: timestamp("billing_period_end", {
    withTimezone: true,
  }).notNull(),

  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),

  currencyCode: varchar("currency_code", { length: 3 })
    .notNull()
    .default("INR"),

  status: invoiceStatusEnum("status").notNull().default("ISSUED"),

  issuedAt: timestamp("issued_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  dueAt: timestamp("due_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),

  pdfUrl: text("pdf_url"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
