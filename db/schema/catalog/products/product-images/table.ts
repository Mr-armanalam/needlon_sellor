import {
    AnyPgColumn,
    bigint, boolean,
    check,
    index, integer,
    jsonb,
    pgTable,
    text,
    timestamp, uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import { productsTable } from "@/db/schema/catalog/products/table";

import {
    productImageStatusEnum,
    productImageStorageProviderEnum,
    productImageTypeEnum,
} from "../../enums";

import type { ProductImageMetadata } from "./metadata";

import {
    PRODUCT_IMAGE_ALT_TEXT_MAX_LENGTH,
    PRODUCT_IMAGE_CHECKSUM_MAX_LENGTH,
    PRODUCT_IMAGE_FILE_NAME_MAX_LENGTH,
    PRODUCT_IMAGE_MIME_TYPE_MAX_LENGTH,
    PRODUCT_IMAGE_STORAGE_PATH_MAX_LENGTH,
    PRODUCT_IMAGE_URL_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================
 * Product Images
 * ============================================================
 *
 * Stores every image belonging to a product.
 *
 * Supports:
 *
 * • Gallery images
 * • Cover image
 * • Thumbnail
 * • Detail images
 * • Future variant images
 *
 * Images are intentionally separated from Products
 * to support unlimited media and better scalability.
 *
 * ============================================================
 */

export const productImagesTable = pgTable(
    "product_media",
    {
        /**
         * ----------------------------------------------------------
         * Identity
         * ----------------------------------------------------------
         */

        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        /**
         * ----------------------------------------------------------
         * Product
         * ----------------------------------------------------------
         */

        productId: uuid("product_id")
            .notNull()
            .references(
                (): AnyPgColumn => productsTable.id,
                {
                    onDelete: "cascade",
                },
            ),

        variantId: uuid("variant_id"),

        storageKey: varchar("storage_key"),

        /**
         * Public or signed CDN URL.
         */
        imageUrl: text("cdn_url").notNull(),

        mediaType: varchar("media_type").default("IMAGE"),

        /**
         * Accessibility & SEO.
         */
        altText: varchar("alt_text", {
            length: PRODUCT_IMAGE_ALT_TEXT_MAX_LENGTH,
        }),

        /**
         * Controls gallery ordering.
         */
        displayOrder: integer("display_order")
            .default(0),

        /**
         * Primary image used throughout
         * the storefront.
         *
         * Service layer ensures only one
         * primary image exists per product.
         */
        isPrimary: boolean("is_primary")
            .default(false),

        /**
         * Active / Inactive / Archived.
         */
        status: varchar("status").default("ACTIVE"),

        /**
         * ----------------------------------------------------------
         * Timestamps
         * ----------------------------------------------------------
         */

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

/**
 * ----------------------------------------------------------
 * Continue in Part 4...
 * ----------------------------------------------------------
 */

    },
    (table) => ({
        productIdx: index("product_images_product_idx").on(table.productId),
        productDisplayOrderIdx: index("product_images_product_display_order_idx").on(table.productId, table.displayOrder),
        productStatusIdx: index("product_images_product_status_idx").on(table.productId, table.status),
        primaryImageIdx: index("product_images_primary_idx").on(table.productId, table.isPrimary),
        createdAtIdx: index("product_images_created_at_idx").on(table.createdAt),
    }),
);