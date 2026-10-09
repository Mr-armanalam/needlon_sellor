import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "../users";
import { productsTable } from "../catalog/products";

export const wishlistTable = pgTable("client_wishlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
