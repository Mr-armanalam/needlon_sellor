import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { productItems } from "./product-items";

export const productCategory = pgTable("product_category", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  category: text("category").notNull(),
  CatType: text("category_type").notNull(),
  SubCatType: text("sub_category_type").notNull(),
  contentTag: text("content_tag"), 
  descriptiveContent: text("descriptive_content"),
  createdAt: timestamp('createdat').defaultNow()
});

export const productCategoryRelation = relations(productCategory, ({many})=> ({
  product: many(productItems),
}))