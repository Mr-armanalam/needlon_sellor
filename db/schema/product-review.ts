import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { productItems } from "./product-items";

export const productReview = pgTable("productReview", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => productItems.id, {
    onDelete: "cascade",
  }),
  userId: uuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  userName: text('username').notNull(),
  rating: integer('rating').default(0).notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productReviewRelation = relations(productReview, ({one }) => ({
 user: one(usersTable, {
    fields: [productReview.userId],
    references: [usersTable.id],
  }),  
  product: one(productItems, {
    fields: [productReview.productId],
    references: [productItems.id]
  }),
}));

