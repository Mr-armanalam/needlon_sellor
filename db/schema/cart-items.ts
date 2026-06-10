import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersTable } from "./users";
import { productItems } from "./product-items";

// 🟢 Define enum for clothes status
export const clothesStatusEnum = pgEnum("clothes_status", [
  "received",
  "cut",
  "stitching",
  "ready",
]);

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => productItems.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  size: text("size"),
  status: clothesStatusEnum("status").notNull().default("received"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(usersTable, {
    fields: [cartItems.userId],
    references: [usersTable.id],
  }),
  product: one(productItems, {
    fields: [cartItems.productId],
    references: [productItems.id],
  }),
}));
