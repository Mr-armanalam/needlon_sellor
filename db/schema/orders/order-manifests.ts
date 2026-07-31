import {
  index,
  integer,
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

export const orderManifestStatusEnum = pgEnum("order_manifest_status", [
  "GENERATED",
  "DISPATCHED",
  "CANCELLED",
]);

export const orderManifests = pgTable(
  "order_manifests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sellerId: uuid("seller_id")
      .notNull()
      .references(() => seller.id, { onDelete: "restrict" }),
    manifestNumber: varchar("manifest_number", { length: 100 }).notNull().unique(),
    courierName: varchar("courier_name", { length: 100 }).notNull(),
    pickupDate: timestamp("pickup_date", { withTimezone: true, mode: "date" }).notNull(),
    totalOrders: integer("total_orders").notNull().default(0),
    totalWeight: numeric("total_weight", { precision: 10, scale: 3 }).default("0").notNull(),
    status: orderManifestStatusEnum("status").default("GENERATED").notNull(),
    pdfUrl: text("pdf_url"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    sellerIdx: index("order_manifests_seller_idx").on(table.sellerId),
    manifestNumIdx: index("order_manifests_number_idx").on(table.manifestNumber),
  })
);

export const orderManifestItems = pgTable(
  "order_manifest_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    manifestId: uuid("manifest_id")
      .notNull()
      .references(() => orderManifests.id, { onDelete: "cascade" }),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    manifestIdx: index("order_manifest_items_manifest_idx").on(table.manifestId),
    orderIdx: index("order_manifest_items_order_idx").on(table.orderId),
  })
);
