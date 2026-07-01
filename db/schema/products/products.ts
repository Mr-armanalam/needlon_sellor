import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { brands } from "../seller/brand";
import { categories } from "../category/categories";

// Defining Enums based on lifecycle and visibility rules
export const productTypeEnum = pgEnum("product_type", [
  "PHYSICAL",
  "DIGITAL",
  "SERVICE",
]);
export const productStatusEnum = pgEnum("product_status", [
  "DRAFT",
  "INCOMPLETE",
  "PUBLISHED",
  "ARCHIVED",
]);
export const productVisibilityEnum = pgEnum("product_visibility", [
  "PUBLIC",
  "HIDDEN",
  "PRIVATE",
]);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Cross-Domain Foreign Keys
    sellerId: uuid("seller_id").notNull(), // Links to your seller/user table
    categoryId: uuid("category_id")
      .references(() => categories.id, { onDelete: "restrict" })
      .notNull(),
    brandId: uuid("brand_id").references(() => brands.id, {
      onDelete: "set null",
    }),

    // Content & Identity
    name: varchar("name", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull(),
    shortDescription: varchar("short_description", { length: 500 }),
    description: text("description"),

    // Configuration Enums
    productType: productTypeEnum("product_type").default("PHYSICAL").notNull(),
    status: productStatusEnum("status").default("DRAFT").notNull(),
    visibility: productVisibilityEnum("visibility").default("PUBLIC").notNull(),

    // Platform Metrics
    isFeatured: boolean("is_featured").default(false).notNull(),

    // Timestamps & Lifecycle Audits
    publishedAt: timestamp("published_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }), // For Soft Delete support
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("products_slug_idx").on(table.slug),
    index("products_seller_idx").on(table.sellerId),
    index("products_category_idx").on(table.categoryId),
    index("products_status_idx").on(table.status),
  ],
);
