import {
  pgTable,
  uuid,
  integer,
  varchar,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { relations } from "drizzle-orm";
import { orderItems } from "./order-items";
import { userAddress } from "./user-address";
import { coupons } from "./coupons";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  total: integer("total").notNull(),
  currency: varchar("currency", { length: 10 }).default("INR"),
  paymentMode: varchar("paymentMode").default("card"),
  status: varchar("status", { length: 20 }).notNull().default("PENDING"),
  paymentId: text("payment_id"),
  coupon_discount: integer("coupon_discount"),
  couponId: uuid("couponId").references(() => coupons.id),
  mrp_price: integer("mrp_price"),
  pod_charge: integer("pod_charge"),
  shipping_address: uuid("shipping_address")
    .references(() => userAddress.id, { onDelete: "cascade" })
    .notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const ordersRelation = relations(orders, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [orders.userId],
    references: [usersTable.id],
  }),

  address: one(userAddress, {
    fields: [orders.shipping_address],
    references: [userAddress.id],
  }),
  orderItems: many(orderItems),
}));
