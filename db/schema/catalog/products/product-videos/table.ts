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
    productVideoStatusEnum,
    productVideoStorageProviderEnum,
    productVideoTypeEnum,
} from "../../enums";

import type { ProductVideoMetadata } from "./metadata";

import {
    PRODUCT_VIDEO_CHECKSUM_MAX_LENGTH,
    PRODUCT_VIDEO_DESCRIPTION_MAX_LENGTH,
    PRODUCT_VIDEO_FILE_NAME_MAX_LENGTH, PRODUCT_VIDEO_MIME_TYPE_MAX_LENGTH,
    PRODUCT_VIDEO_STORAGE_PATH_MAX_LENGTH,
    PRODUCT_VIDEO_THUMBNAIL_URL_MAX_LENGTH,
    PRODUCT_VIDEO_TITLE_MAX_LENGTH,
    PRODUCT_VIDEO_URL_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================
 * product-videos
 * ============================================================
 *
 * Stores every video belonging to a product.
 *
 * Supports:
 *
 * • Product demos
 * • Tutorials
 * • Promotional videos
 * • Gallery videos
 * • Future 360° videos
 *
 * Videos are intentionally separated from Products
 * to support scalable media management and
 * provider-independent streaming.
 *
 * ============================================================
 */

export const productVideosTable = pgTable(
    "product_videos",
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
            productVideoStorageProviderEnum(
                "storage_provider",
            )
                .notNull()
                .default("SUPABASE"),

        /**
         * Provider-specific storage path.
         *
         * Examples:
         *
         * products/123/demo.mp4
         * seller/abc/products/xyz/video.webm
         */
        storagePath: varchar(
            "storage_path",
            {
                length:
                PRODUCT_VIDEO_STORAGE_PATH_MAX_LENGTH,
            },
        ).notNull(),

        /**
         * Public or signed streaming URL.
         */
        videoUrl: varchar("video_url", {
            length: PRODUCT_VIDEO_URL_MAX_LENGTH,
        }).notNull(),

        /**
         * Thumbnail used by product gallery
         * before playback.
         */
        thumbnailUrl: varchar(
            "thumbnail_url",
            {
                length:
                PRODUCT_VIDEO_THUMBNAIL_URL_MAX_LENGTH,
            },
        ),

/**
 * ----------------------------------------------------------
 * Continue in Part 2...
 * ----------------------------------------------------------
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
            length: PRODUCT_VIDEO_FILE_NAME_MAX_LENGTH,
        }).notNull(),

        /**
         * MIME type.
         *
         * Examples:
         *
         * video/mp4
         * video/webm
         * video/quicktime
         */
        mimeType: varchar("mime_type", {
            length: PRODUCT_VIDEO_MIME_TYPE_MAX_LENGTH,
        }).notNull(),

        /**
         * Video file size (bytes).
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
            length: PRODUCT_VIDEO_CHECKSUM_MAX_LENGTH,
        }).notNull(),

        /**
         * ----------------------------------------------------------
         * Video Information
         * ----------------------------------------------------------
         */

        /**
         * Duration in seconds.
         */
        durationSeconds: bigint(
            "duration_seconds",
            {
                mode: "number",
            },
        ).notNull(),

        /**
         * Video width in pixels.
         */
        width: bigint("width", {
            mode: "number",
        }).notNull(),

        /**
         * Video height in pixels.
         */
        height: bigint("height", {
            mode: "number",
        }).notNull(),

        /**
         * ----------------------------------------------------------
         * Presentation
         * ----------------------------------------------------------
         */

        /**
         * Optional display title.
         */
        title: varchar("title", {
            length: PRODUCT_VIDEO_TITLE_MAX_LENGTH,
        }),

        /**
         * Optional description.
         */
        description: varchar(
            "description",
            {
                length:
                PRODUCT_VIDEO_DESCRIPTION_MAX_LENGTH,
            },
        ),

        /**
         * Controls gallery ordering.
         */
        displayOrder: integer(
            "display_order",
        )
            .notNull()
            .default(0),

        /**
         * ----------------------------------------------------------
         * Business
         * ----------------------------------------------------------
         */

        /**
         * Demo / Tutorial /
         * Promotional / Gallery.
         */
        videoType: productVideoTypeEnum(
            "video_type",
        )
            .notNull()
            .default("GALLERY"),

        /**
         * Primary storefront video.
         *
         * Service layer ensures only one
         * primary video exists per product.
         */
        isPrimary: boolean("is_primary")
            .notNull()
            .default(false),

        /**
         * Active / Inactive / Archived.
         */
        status: productVideoStatusEnum(
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
            .$type<ProductVideoMetadata>()
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
         * ==========================================================
         * Uniqueness
         * ==========================================================
         */

        /**
         * Prevent duplicate storage objects.
         */
        storagePathUniqueIdx: uniqueIndex(
            "product_videos_storage_path_uidx",
        ).on(table.storagePath),

        /**
         * Prevent duplicate uploads for the same product.
         */
        productChecksumUniqueIdx: uniqueIndex(
            "product_videos_product_checksum_uidx",
        ).on(
            table.productId,
            table.checksum,
        ),

        /**
         * ==========================================================
         * Product
         * ==========================================================
         */

        productIdx: index(
            "product_videos_product_idx",
        ).on(table.productId),

        productDisplayOrderIdx: index(
            "product_videos_product_display_order_idx",
        ).on(
            table.productId,
            table.displayOrder,
        ),

        productStatusIdx: index(
            "product_videos_product_status_idx",
        ).on(
            table.productId,
            table.status,
        ),

        productVideoTypeIdx: index(
            "product_videos_product_video_type_idx",
        ).on(
            table.productId,
            table.videoType,
        ),

        primaryVideoIdx: index(
            "product_videos_primary_idx",
        ).on(
            table.productId,
            table.isPrimary,
        ),

        /**
         * ==========================================================
         * Storage
         * ==========================================================
         */

        storageProviderIdx: index(
            "product_videos_storage_provider_idx",
        ).on(table.storageProvider),

        /**
         * ==========================================================
         * Audit
         * ==========================================================
         */

        createdByIdx: index(
            "product_videos_created_by_idx",
        ).on(table.createdBy),

        updatedByIdx: index(
            "product_videos_updated_by_idx",
        ).on(table.updatedBy),

        /**
         * ==========================================================
         * Lifecycle
         * ==========================================================
         */

        createdAtIdx: index(
            "product_videos_created_at_idx",
        ).on(table.createdAt),

        deletedAtIdx: index(
            "product_videos_deleted_at_idx",
        ).on(table.deletedAt),

        /**
         * ==========================================================
         * Database Constraints
         * ==========================================================
         */

        widthCheck: check(
            "product_videos_width_check",
            sql`${table.width} > 0`,
        ),

        heightCheck: check(
            "product_videos_height_check",
            sql`${table.height} > 0`,
        ),

        durationCheck: check(
            "product_videos_duration_check",
            sql`${table.durationSeconds} > 0`,
        ),

        fileSizeCheck: check(
            "product_videos_file_size_check",
            sql`${table.fileSize} > 0`,
        ),

        displayOrderCheck: check(
            "product_videos_display_order_check",
            sql`${table.displayOrder} >= 0`,
        ),
    }),
);