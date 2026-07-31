import {
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { orders } from "./table";
import { seller } from "@/db/schema/seller";

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "DRAFT",
  "ISSUED",
  "CANCELLED",
]);

export const orderInvoices = pgTable(
  "order_invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    sellerId: uuid("seller_id")
      .notNull()
      .references(() => seller.id, { onDelete: "restrict" }),
    invoiceNumber: varchar("invoice_number", { length: 100 }).notNull().unique(),
    status: invoiceStatusEnum("status").default("ISSUED").notNull(),
    subtotal: numeric("subtotal", { precision: 18, scale: 2 }).notNull(),
    taxTotal: numeric("tax_total", { precision: 18, scale: 2 }).default("0").notNull(),
    discountTotal: numeric("discount_total", { precision: 18, scale: 2 }).default("0").notNull(),
    shippingCharge: numeric("shipping_charge", { precision: 18, scale: 2 }).default("0").notNull(),
    grandTotal: numeric("grand_total", { precision: 18, scale: 2 }).notNull(),
    pdfUrl: text("pdf_url"),
    issuedAt: timestamp("issued_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    orderIdx: index("order_invoices_order_idx").on(table.orderId),
    sellerIdx: index("order_invoices_seller_idx").on(table.sellerId),
    invoiceNumIdx: index("order_invoices_number_idx").on(table.invoiceNumber),
  })
);
