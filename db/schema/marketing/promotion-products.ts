import {
  pgTable,
  uuid,
  smallint,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { promotions } from "./promotion";
import { products } from "../products/products";

export const promotionProducts = pgTable(
  "promotion_products",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    promotionId: uuid("promotion_id")
      .notNull()
      .references(() => promotions.id, { onDelete: "cascade" }),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    priority: smallint("priority").notNull().default(100),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Prevent duplicate product-promotion links
    uniqueIndex("promotion_product_unique_idx").on(
      table.promotionId,
      table.productId,
    ),
  ],
);
