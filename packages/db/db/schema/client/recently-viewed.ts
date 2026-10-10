import { pgTable, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { usersTable } from "../users";
import { productsTable } from "../catalog/products";

export const clientRecentlyViewedTable = pgTable(
  "client_recently_viewed",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
    viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  },
  (table) => ({
    userRecentIdx: index("client_recently_viewed_user_idx").on(table.userId),
    productRecentIdx: index("client_recently_viewed_product_idx").on(table.productId),
  })
);

export type ClientRecentlyViewed = typeof clientRecentlyViewedTable.$inferSelect;
export type NewClientRecentlyViewed = typeof clientRecentlyViewedTable.$inferInsert;
