import { sql } from "drizzle-orm";
import {
    AnyPgColumn,
    boolean,
    check,
    index,
    integer,
    jsonb,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import { categoriesTable } from "@/db/schema/catalog/categories";

import {
    productStatusEnum,
    productTypeEnum,
    productVisibilityEnum,
} from "../enums";

import type { ProductMetadata } from "./metadata";

import {
    PRODUCT_BRAND_MAX_LENGTH,
    PRODUCT_COUNTRY_OF_ORIGIN_MAX_LENGTH,
    PRODUCT_DESCRIPTION_MAX_LENGTH,
    PRODUCT_HSN_CODE_MAX_LENGTH,
    PRODUCT_MODEL_MAX_LENGTH,
    PRODUCT_NAME_MAX_LENGTH,
    PRODUCT_SHORT_DESCRIPTION_MAX_LENGTH,
    PRODUCT_SKU_MAX_LENGTH,
    PRODUCT_SLUG_MAX_LENGTH,
    PRODUCT_WARRANTY_MAX_LENGTH,
} from "./constants";
import {sellerStore} from "@/db/schema/seller/seller-store";

/**
 * ============================================================
 * Products
 * ============================================================
 *
 * Root entity of the commerce system.
 *
 * Everything else references products.
 *
 * Images
 * Videos
 * Inventory
 * Pricing
 * Variants
 * Attributes
 * SEO
 * Orders
 * Wishlist
 * Cart
 *
 * ============================================================
 */

export const productsTable = pgTable(
    "products",
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
         * Ownership
         * ----------------------------------------------------------
         */

        storeId: uuid("store_id")
            .notNull()
            .references(
                (): AnyPgColumn => sellerStore.sellerId,
                {
                    onDelete: "cascade",
                },
            ),

        /**
         * ----------------------------------------------------------
         * Classification
         * ----------------------------------------------------------
         */

        categoryId: uuid("category_id")
            .notNull()
            .references(
                (): AnyPgColumn => categoriesTable.id,
                {
                    onDelete: "restrict",
                },
            ),

        /**
         * ----------------------------------------------------------
         * Product Identity
         * ----------------------------------------------------------
         */

        /**
         * Customer-facing product name.
         */
        name: varchar("name", {
            length: PRODUCT_NAME_MAX_LENGTH,
        }).notNull(),

        /**
         * SEO-friendly unique slug.
         */
        slug: varchar("slug", {
            length: PRODUCT_SLUG_MAX_LENGTH,
        }).notNull(),

        /**
         * Seller SKU.
         *
         * Unique only within a store.
         */
        sku: varchar("sku", {
            length: PRODUCT_SKU_MAX_LENGTH,
        }).notNull(),

        /**
         * Optional manufacturer brand.
         */
        brand: varchar("brand", {
            length: PRODUCT_BRAND_MAX_LENGTH,
        }),

        /**
         * Optional manufacturer model.
         */
        model: varchar("model", {
            length: PRODUCT_MODEL_MAX_LENGTH,
        }),

        /**
         * Indian HSN code.
         */
        hsnCode: varchar("hsn_code", {
            length: PRODUCT_HSN_CODE_MAX_LENGTH,
        }),

        /**
         * Country of origin.
         */
        countryOfOrigin: varchar(
            "country_of_origin",
            {
                length:
                PRODUCT_COUNTRY_OF_ORIGIN_MAX_LENGTH,
            },
        ),

/**
 * Continue in Part 2...
 */

        /**
         * ----------------------------------------------------------
         * Product Information
         * ----------------------------------------------------------
         */

        /**
         * Short summary displayed in cards,
         * search results and previews.
         */
        shortDescription: varchar(
            "short_description",
            {
                length:
                PRODUCT_SHORT_DESCRIPTION_MAX_LENGTH,
            },
        ),

        /**
         * Full product description.
         *
         * Rich text / markdown HTML is handled
         * by the application layer.
         */
        description: varchar(
            "description",
            {
                length:
                PRODUCT_DESCRIPTION_MAX_LENGTH,
            },
        ),

        /**
         * Seller warranty information.
         */
        warranty: varchar("warranty", {
            length: PRODUCT_WARRANTY_MAX_LENGTH,
        }),

        /**
         * ----------------------------------------------------------
         * Product Lifecycle
         * ----------------------------------------------------------
         */

        status: productStatusEnum("status")
            .notNull()
            .default("DRAFT"),

        visibility:
            productVisibilityEnum(
                "visibility",
            )
                .notNull()
                .default("PRIVATE"),

        /**
         * Physical / Digital / Service etc.
         */
        productType: productTypeEnum(
            "product_type",
        )
            .notNull()
            .default("PHYSICAL"),

        /**
         * ----------------------------------------------------------
         * Business Flags
         * ----------------------------------------------------------
         */

        /**
         * Featured by platform.
         */
        isFeatured: boolean(
            "is_featured",
        )
            .notNull()
            .default(false),

        /**
         * Seller can temporarily disable
         * purchasing without deleting
         * the product.
         */
        isAvailable: boolean(
            "is_available",
        )
            .notNull()
            .default(true),

        /**
         * Soft publish scheduling.
         *
         * Product becomes visible after
         * this timestamp if eligible.
         */
        publishedAt: timestamp(
            "published_at",
            {
                withTimezone: true,
            },
        ),

        /**
         * Manual archive timestamp.
         */
        archivedAt: timestamp(
            "archived_at",
            {
                withTimezone: true,
            },
        ),

        /**
         * Internal ordering inside seller
         * product listing.
         */
        sortOrder: integer("sort_order")
            .notNull()
            .default(0),

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
            .$type<ProductMetadata>()
            .default(sql`'{}'::jsonb`)
            .notNull(),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdBy: uuid("created_by").references(
            () => seller.id,
            {
                onDelete: "set null",
            },
        ),

        updatedBy: uuid("updated_by").references(
            () => seller.id,
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
         * Unique Constraints
         * ----------------------------------------------------------
         */

        /**
         * Global SEO slug.
         */
        productSlugUniqueIdx: uniqueIndex(
            "products_slug_uidx",
        ).on(table.slug),

        categoryListingIdx: index(
            "products_category_listing_idx",
        ).on(
            table.categoryId,
            table.visibility,
            table.status,
            table.createdAt,
        ),

        storeUpdatedIdx: index(
            "products_store_updated_idx",
        ).on(
            table.storeId,
            table.updatedAt,
        ),

        /**
         * SKU must be unique inside a store.
         */
        productStoreSkuUniqueIdx: uniqueIndex(
            "products_store_sku_uidx",
        ).on(
            table.storeId,
            table.sku,
        ),

        /**
         * ----------------------------------------------------------
         * Foreign Keys
         * ----------------------------------------------------------
         */

        storeIdx: index(
            "products_store_idx",
        ).on(table.storeId),

        categoryIdx: index(
            "products_category_idx",
        ).on(table.categoryId),

        /**
         * ----------------------------------------------------------
         * Product Listing
         * ----------------------------------------------------------
         */

        productStoreSortOrderIdx: index(
            "products_store_sort_order_idx",
        ).on(
            table.storeId,
            table.sortOrder,
        ),

        /**
         * Seller dashboard
         */

        productStoreStatusIdx: index(
            "products_store_status_idx",
        ).on(
            table.storeId,
            table.status,
        ),

        /**
         * Marketplace listing
         */

        productVisibilityStatusIdx: index(
            "products_visibility_status_idx",
        ).on(
            table.visibility,
            table.status,
        ),

        /**
         * Category browsing
         */

        productCategoryStatusIdx: index(
            "products_category_status_idx",
        ).on(
            table.categoryId,
            table.status,
        ),

        /**
         * Category browsing (public)
         */

        productCategoryVisibilityStatusIdx: index(
            "products_category_visibility_status_idx",
        ).on(
            table.categoryId,
            table.visibility,
            table.status,
        ),

        /**
         * Product type
         */

        productTypeStatusIdx: index(
            "products_type_status_idx",
        ).on(
            table.productType,
            table.status,
        ),

        /**
         * Featured products
         */

        featuredProductsIdx: index(
            "products_featured_idx",
        ).on(
            table.isFeatured,
            table.status,
        ),

        /**
         * Availability
         */

        availableProductsIdx: index(
            "products_available_idx",
        ).on(
            table.isAvailable,
            table.status,
        ),

        /**
         * Publish scheduler
         */

        publishedAtIdx: index(
            "products_published_at_idx",
        ).on(table.publishedAt),

        archivedAtIdx: index(
            "products_archived_at_idx",
        ).on(table.archivedAt),

        /**
         * Audit
         */

        createdByIdx: index(
            "products_created_by_idx",
        ).on(table.createdBy),

        updatedByIdx: index(
            "products_updated_by_idx",
        ).on(table.updatedBy),

        /**
         * Soft delete
         */

        deletedAtIdx: index(
            "products_deleted_at_idx",
        ).on(table.deletedAt),

        /**
         * ----------------------------------------------------------
         * Database Constraints
         * ----------------------------------------------------------
         */

        sortOrderCheck: check(
            "products_sort_order_check",
            sql`${table.sortOrder} >= 0`,
        ),
    }),
);