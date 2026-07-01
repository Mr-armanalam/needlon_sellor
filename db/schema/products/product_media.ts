import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { products } from "./products";
import { productVariants } from "./product_variants";
import { isNotNull } from "drizzle-orm";

// Broadened enums to support future asset models and async rendering pipelines
export const mediaTypeEnum = pgEnum("product_media_type", [
  "IMAGE",
  "VIDEO",
  "MODEL_3D",
  "AR",
  "SPIN_360",
]);

export const mediaStatusEnum = pgEnum("product_media_status", [
  "UPLOADING",
  "PROCESSING",
  "ACTIVE",
  "FAILED",
]);

export const productMedia = pgTable(
  "product_media",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),

    // Scoped variant connection. Null value indicates standard global product gallery item
    variantId: uuid("variant_id").references(() => productVariants.id, {
      onDelete: "cascade",
    }),

    storageKey: varchar("storage_key", { length: 500 }).notNull(), // S3, Cloudflare R2 unique identifier
    cdnUrl: text("cdn_url").notNull(), // Optimized global content delivery URL
    mediaType: mediaTypeEnum("media_type").default("IMAGE").notNull(),

    altText: varchar("alt_text", { length: 255 }),
    displayOrder: integer("display_order").default(0).notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(), // Main thumbnail/cover display target
    status: mediaStatusEnum("status").default("ACTIVE").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("prod_media_product_idx").on(table.productId, table.displayOrder),
    index("prod_media_variant_idx")
      .on(table.variantId)
      .where(isNotNull(table.variantId)),
  ],
);
