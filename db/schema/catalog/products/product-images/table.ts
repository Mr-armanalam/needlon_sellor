import { sql } from "drizzle-orm";
import {
    AnyPgColumn,
    bigint, boolean,
    check,
    index, integer,
    jsonb,
    pgTable,
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
    "product_images",
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

        /**
         * ----------------------------------------------------------
         * Storage
         * ----------------------------------------------------------
         */

        storageProvider:
            productImageStorageProviderEnum(
                "storage_provider",
            )
                .notNull()
                .default("SUPABASE"),

        /**
         * Provider-specific object path.
         *
         * Examples:
         *
         * products/123/front.jpg
         * seller/abc/products/xyz/image.webp
         */
        storagePath: varchar(
            "storage_path",
            {
                length:
                PRODUCT_IMAGE_STORAGE_PATH_MAX_LENGTH,
            },
        ).notNull(),

        /**
         * Public or signed CDN URL.
         */
        imageUrl: varchar("image_url", {
            length: PRODUCT_IMAGE_URL_MAX_LENGTH,
        }).notNull(),

/**
 * Continue in Part 2...
 */

        /**
         * ----------------------------------------------------------
         * File Information
         * ----------------------------------------------------------
         */

        /**
         * Original uploaded filename.
         */
        fileName: varchar("file_name", {
            length: PRODUCT_IMAGE_FILE_NAME_MAX_LENGTH,
        }).notNull(),

        /**
         * MIME type.
         *
         * Examples:
         * image/jpeg
         * image/png
         * image/webp
         * image/avif
         */
        mimeType: varchar("mime_type", {
            length: PRODUCT_IMAGE_MIME_TYPE_MAX_LENGTH,
        }).notNull(),

        /**
         * Image width in pixels.
         */
        width: bigint("width", {
            mode: "number",
        }).notNull(),

        /**
         * Image height in pixels.
         */
        height: bigint("height", {
            mode: "number",
        }).notNull(),

        /**
         * File size in bytes.
         */
        fileSize: bigint("file_size", {
            mode: "number",
        }).notNull(),

        /**
         * SHA-256 checksum.
         *
         * Used for:
         * - Duplicate detection
         * - Integrity verification
         */
        checksum: varchar("checksum", {
            length: PRODUCT_IMAGE_CHECKSUM_MAX_LENGTH,
        }).notNull(),

        /**
         * ----------------------------------------------------------
         * Presentation
         * ----------------------------------------------------------
         */

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
            .notNull()
            .default(0),

        /**
         * ----------------------------------------------------------
         * Business
         * ----------------------------------------------------------
         */

        /**
         * Gallery / Cover / Thumbnail / Detail.
         */
        imageType: productImageTypeEnum(
            "image_type",
        )
            .notNull()
            .default("GALLERY"),

        /**
         * Primary image used throughout
         * the storefront.
         *
         * Service layer ensures only one
         * primary image exists per product.
         */
        isPrimary: boolean("is_primary")
            .notNull()
            .default(false),

        /**
         * Active / Inactive / Archived.
         */
        status: productImageStatusEnum(
            "status",
        )
            .notNull()
            .default("ACTIVE"),

/**
 * ----------------------------------------------------------
 * Continue in Part 3...
 * ----------------------------------------------------------
 */

        /**
         * ----------------------------------------------------------
         * Metadata
         * ----------------------------------------------------------
         */

        metadata: jsonb("metadata")
            .$type<ProductImageMetadata>()
            .default(sql`'{}'::jsonb`)
            .notNull(),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdBy: uuid("created_by").references(
            (): AnyPgColumn => seller.id,
            {
                onDelete: "set null",
            },
        ),

        updatedBy: uuid("updated_by").references(
            (): AnyPgColumn => seller.id,
            {
                onDelete: "set null",
            },
        ),

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
         * Soft Delete
         * ----------------------------------------------------------
         */

        deletedAt: timestamp("deleted_at", {
            withTimezone: true,
        }),

/**
 * ----------------------------------------------------------
 * Continue in Part 4...
 * ----------------------------------------------------------
 */

    },

    (table) => ({
        /**
         * ----------------------------------------------------------
         * Uniqueness
         * ----------------------------------------------------------
         */

        /**
         * Prevent duplicate storage objects.
         */
        storagePathUniqueIdx: uniqueIndex(
            "product_images_storage_path_uidx",
        ).on(table.storagePath),

        /**
         * Prevent duplicate uploads using checksum.
         *
         * NOTE:
         * This is global. If duplicate uploads should be
         * allowed across different products in the future,
         * change to (productId, checksum).
         */
        checksumUniqueIdx: uniqueIndex(
            "product_images_checksum_uidx",
        ).on(table.checksum),

        /**
         * ----------------------------------------------------------
         * Product
         * ----------------------------------------------------------
         */

        productIdx: index(
            "product_images_product_idx",
        ).on(table.productId),

        /**
         * Gallery ordering
         */

        productDisplayOrderIdx: index(
            "product_images_product_display_order_idx",
        ).on(
            table.productId,
            table.displayOrder,
        ),

        /**
         * Product gallery by status
         */

        productStatusIdx: index(
            "product_images_product_status_idx",
        ).on(
            table.productId,
            table.status,
        ),

        /**
         * Product image type
         */

        productImageTypeIdx: index(
            "product_images_product_image_type_idx",
        ).on(
            table.productId,
            table.imageType,
        ),

        /**
         * Primary image lookup
         */

        primaryImageIdx: index(
            "product_images_primary_idx",
        ).on(
            table.productId,
            table.isPrimary,
        ),

        /**
         * ----------------------------------------------------------
         * Storage
         * ----------------------------------------------------------
         */

        storageProviderIdx: index(
            "product_images_storage_provider_idx",
        ).on(table.storageProvider),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdByIdx: index(
            "product_images_created_by_idx",
        ).on(table.createdBy),

        updatedByIdx: index(
            "product_images_updated_by_idx",
        ).on(table.updatedBy),

        /**
         * ----------------------------------------------------------
         * Lifecycle
         * ----------------------------------------------------------
         */

        createdAtIdx: index(
            "product_images_created_at_idx",
        ).on(table.createdAt),

        deletedAtIdx: index(
            "product_images_deleted_at_idx",
        ).on(table.deletedAt),

        /**
         * ----------------------------------------------------------
         * Database Constraints
         * ----------------------------------------------------------
         */

        widthCheck: check(
            "product_images_width_check",
            sql`${table.width} > 0`,
        ),

        heightCheck: check(
            "product_images_height_check",
            sql`${table.height} > 0`,
        ),

        fileSizeCheck: check(
            "product_images_file_size_check",
            sql`${table.fileSize} > 0`,
        ),

        displayOrderCheck: check(
            "product_images_display_order_check",
            sql`${table.displayOrder} >= 0`,
        ),
    }),
);