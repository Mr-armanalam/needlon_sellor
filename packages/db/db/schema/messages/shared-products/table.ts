// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/shared-products/table.ts
// Description:
// Stores immutable product snapshots shared inside conversations.
//
// A shared product preserves product information even if the actual
// catalog product changes or is deleted later.
// ============================================================================

import { sql } from "drizzle-orm";

import {
    bigint,
    check,
    index,
    jsonb,
    numeric,
    pgEnum,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { productsTable } from "@/db/schema/catalog/products";

import { messagesTable } from "../messages";

import type { SharedProductMetadata } from "./metadata";

import {
    SHARED_PRODUCT_BRAND_MAX_LENGTH,
    SHARED_PRODUCT_CURRENCY_MAX_LENGTH,
    SHARED_PRODUCT_IMAGE_URL_MAX_LENGTH,
    SHARED_PRODUCT_NAME_MAX_LENGTH,
    SHARED_PRODUCT_PRICE_STATUSES,
    SHARED_PRODUCT_SKU_MAX_LENGTH,
    SHARED_PRODUCT_SLUG_MAX_LENGTH,
    SHARED_PRODUCT_SOURCES,
    SHARED_PRODUCT_STATUSES,
} from "./constants";

/**
 * ============================================================================
 * Enums
 * ============================================================================
 */

export const sharedProductStatusEnum =
    pgEnum(
        "shared_product_status",
        [...SHARED_PRODUCT_STATUSES],
    );

export const sharedProductSourceEnum =
    pgEnum(
        "shared_product_source",
        [...SHARED_PRODUCT_SOURCES],
    );

export const sharedProductPriceStatusEnum =
    pgEnum(
        "shared_product_price_status",
        [...SHARED_PRODUCT_PRICE_STATUSES],
    );

/**
 * ============================================================================
 * Shared Products
 * ============================================================================
 */

export const sharedProductsTable =
    pgTable(
        "shared_products",
        {
            /**
             * ----------------------------------------------------------------------
             * Identity
             * ----------------------------------------------------------------------
             */

            id: uuid("id")
                .defaultRandom()
                .primaryKey(),

            /**
             * ----------------------------------------------------------------------
             * Relations
             * ----------------------------------------------------------------------
             */

            messageId: uuid("message_id")
                .notNull()
                .references(
                    () => messagesTable.id,
                    {
                        onDelete: "cascade",
                    },
                ),

            productId: uuid("product_id")
                .references(
                    () => productsTable.id,
                    {
                        onDelete: "set null",
                    },
                ),

            /**
             * ----------------------------------------------------------------------
             * Immutable Snapshot
             * ----------------------------------------------------------------------
             */

            productName: varchar(
                "product_name",
                {
                    length:
                    SHARED_PRODUCT_NAME_MAX_LENGTH,
                },
            ).notNull(),

            slug: varchar("slug", {
                length:
                SHARED_PRODUCT_SLUG_MAX_LENGTH,
            }).notNull(),

            sku: varchar("sku", {
                length:
                SHARED_PRODUCT_SKU_MAX_LENGTH,
            }),

            brand: varchar("brand", {
                length:
                SHARED_PRODUCT_BRAND_MAX_LENGTH,
            }),

            thumbnailUrl: varchar(
                "thumbnail_url",
                {
                    length:
                    SHARED_PRODUCT_IMAGE_URL_MAX_LENGTH,
                },
            ),

            currency: varchar(
                "currency",
                {
                    length:
                    SHARED_PRODUCT_CURRENCY_MAX_LENGTH,
                },
            )
                .default("INR")
                .notNull(),

            sellingPrice: numeric(
                "selling_price",
                {
                    precision: 12,
                    scale: 2,
                },
            ).notNull(),

            mrp: numeric("mrp", {
                precision: 12,
                scale: 2,
            }),

            /**
             * ----------------------------------------------------------------------
             * Snapshot Status
             * ----------------------------------------------------------------------
             */

            status:
                sharedProductStatusEnum(
                    "status",
                )
                    .default("ACTIVE")
                    .notNull(),

            source:
                sharedProductSourceEnum(
                    "source",
                )
                    .default("PRODUCT_PAGE")
                    .notNull(),

            priceStatus:
                sharedProductPriceStatusEnum(
                    "price_status",
                )
                    .default("CURRENT")
                    .notNull(),

            /**
             * ----------------------------------------------------------------------
             * Analytics
             * ----------------------------------------------------------------------
             */

            sharedCount: bigint(
                "shared_count",
                {
                    mode: "number",
                },
            )
                .default(1)
                .notNull(),

            openedCount: bigint(
                "opened_count",
                {
                    mode: "number",
                },
            )
                .default(0)
                .notNull(),

            /**
             * ----------------------------------------------------------------------
             * Metadata
             * ----------------------------------------------------------------------
             */

            metadata: jsonb(
                "metadata",
            )
                .$type<SharedProductMetadata>()
                .default(
                    sql`'{}'::jsonb`,
                )
                .notNull(),

            /**
             * ----------------------------------------------------------------------
             * Timeline
             * ----------------------------------------------------------------------
             */

            sharedAt: timestamp(
                "shared_at",
                {
                    withTimezone: true,
                },
            )
                .defaultNow()
                .notNull(),

            createdAt: timestamp(
                "created_at",
                {
                    withTimezone: true,
                },
            )
                .defaultNow()
                .notNull(),

            updatedAt: timestamp(
                "updated_at",
                {
                    withTimezone: true,
                },
            )
                .defaultNow()
                .notNull(),
        },

        (table) => ({
            /**
             * ============================================================
             * Uniqueness
             * ============================================================
             */

            messageUniqueIdx:
                uniqueIndex(
                    "shared_products_message_uidx",
                ).on(table.messageId),

            /**
             * ============================================================
             * Lookup Indexes
             * ============================================================
             */

            productIdx: index(
                "shared_products_product_idx",
            ).on(table.productId),

            messageIdx: index(
                "shared_products_message_idx",
            ).on(table.messageId),

            statusIdx: index(
                "shared_products_status_idx",
            ).on(table.status),

            sourceIdx: index(
                "shared_products_source_idx",
            ).on(table.source),

            sharedAtIdx: index(
                "shared_products_shared_at_idx",
            ).on(table.sharedAt),

            /**
             * ============================================================
             * Constraints
             * ============================================================
             */

            sellingPriceCheck: check(
                "shared_products_selling_price_chk",
                sql`${table.sellingPrice} >= 0`,
            ),

            mrpCheck: check(
                "shared_products_mrp_chk",
                sql`${table.mrp} IS NULL OR ${table.mrp} >= ${table.sellingPrice}`,
            ),

            sharedCountCheck: check(
                "shared_products_shared_count_chk",
                sql`${table.sharedCount} >= 1`,
            ),

            openedCountCheck: check(
                "shared_products_opened_count_chk",
                sql`${table.openedCount} >= 0`,
            ),
        }),
    );