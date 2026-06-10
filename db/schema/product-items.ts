
import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  numeric,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { productCategory } from "./product-category";
import { productFilterOptions } from "./product-filter-options";
import { usersTable } from "./users";

export const productItems = pgTable("product_items", {
  id: uuid("id").primaryKey().defaultRandom(),

  categoryId: uuid("category_id")
    .notNull()
    .references(() => productCategory.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  tagName: text("tag_name").notNull(),

  mrp_price: integer("mrp_price"),
  price: integer("price").notNull(),

  image: text("image"),
  modalImage: text("modal_image").array(),
  sizes: text("sizes").array(),

  quantity: integer("quantity").default(1).notNull(),

  averageRating: numeric("average_rating", { precision: 3, scale: 2 })
    .default("0.00")
    .notNull(),
  
  seller: uuid('seller').references(() => usersTable.id, {onDelete: 'cascade'}),
  salesCount: integer("sales_count").default(0).notNull(),

  reviewCount: integer("review_count").default(0).notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productItemsRelation = relations(productItems, ({ many }) => ({
  filterOptions: many(productFilterOptions),
}));
