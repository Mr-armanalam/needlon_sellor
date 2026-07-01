import {
  pgTable,
  uuid,
  varchar,
  text,
  smallint,
  boolean,
  integer,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { orderedItems } from "../orders/order-items";
import { product_orders } from "../orders/orders";
import { products } from "../products/products";
import { productVariants } from "../products/product_variants";

// Review Status Enum for moderation pipelines
export const reviewStatusEnum = pgEnum("review_status", [
  "PUBLISHED",
  "PENDING_MODERATION",
  "HIDDEN",
  "REPORTED",
  "REMOVED",
]);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // High-Trust Relational Mapping
    orderItemId: uuid("order_item_id")
      .references(() => orderedItems.id, { onDelete: "restrict" })
      .notNull(),
    orderId: uuid("order_id")
      .references(() => product_orders.id, { onDelete: "restrict" })
      .notNull(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "restrict" })
      .notNull(),
    variantId: uuid("variant_id").references(() => productVariants.id, {
      onDelete: "restrict",
    }),

    // Identity Layers
    buyerId: uuid("buyer_id").notNull(), // Maps to customer profile
    sellerId: uuid("seller_id").notNull(), // Maps to the business owner

    // Core Score Data
    rating: smallint("rating").notNull(), // Valid values: 1 to 5 via check constraint
    title: varchar("title", { length: 150 }),
    reviewText: text("review_text"),

    // Social Integrity Metrics
    isVerifiedPurchase: boolean("is_verified_purchase").default(true).notNull(),
    status: reviewStatusEnum("status").default("PUBLISHED").notNull(),
    helpfulCount: integer("helpful_count").default(0).notNull(),
    sellerReplyCount: integer("seller_reply_count").default(0).notNull(), // Cache indicator for replies

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      // Structural Rule: An ordered line item can only ever be reviewed once by the customer
      reviewOrderItemUniqIdx: uniqueIndex("review_order_item_uniq_idx").on(
        table.orderItemId,
      ),

      // Performance lookup vectors for storefront product detail display feeds
      reviewProductIdx: index("reviews_product_idx").on(
        table.productId,
        table.status,
      ),
      reviewSellerIdx: index("reviews_seller_idx").on(table.sellerId),
    };
  },
);
