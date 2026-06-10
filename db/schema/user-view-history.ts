import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { productItems } from "./product-items";
import { relations } from "drizzle-orm";

export const userViewHistory = pgTable('user_view_history', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id').references(() => usersTable.id, {onDelete: 'cascade'}).notNull(),
  productId: uuid('product_id').references(() => productItems.id, {onDelete: 'cascade'}).notNull(),
  createdAt: timestamp('createdAt').defaultNow()
})

export const userViewHistoryRelation = relations(userViewHistory,({one, many}) => ({
  user: one(usersTable, {
    fields: [userViewHistory.userId],
    references: [usersTable.id]
  }),
  product: one(productItems, {
    fields: [userViewHistory.productId],
    references: [productItems.id]
  }),
}))