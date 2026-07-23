import { sql } from "drizzle-orm";
import {
    AnyPgColumn, boolean,
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

import { productsTable } from "@/db/schema/catalog/products/table";

import { productVariantStatusEnum } from "../../enums";

import type { ProductVariantMetadata } from "./metadata";

import {
    PRODUCT_VARIANT_BARCODE_MAX_LENGTH,
    PRODUCT_VARIANT_SKU_MAX_LENGTH,
    PRODUCT_VARIANT_TITLE_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================
 * Product Variants
 * ============================================================
 *
 * Represents a purchasable variation of a product.
 *
 * Examples:
 *
 * Product:
 * Nike Air Max
 *
 * Variants:
 * - Red / XL
 * - Red / L
 * - Blue / XL
 *
 * Pricing, inventory, shipping and images are intentionally
 * stored in dedicated modules.
 *
 * ============================================================
 */

export const productVariantsTable = pgTable(
    "product_variants",
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
         * Business Identity
         * ----------------------------------------------------------
         */

        /**
         * Human-readable variant title.
         *
         * Examples:
         * - Red / XL
         * - Black / 42
         * - Cotton / Large
         */
        title: varchar("title", {
            length: PRODUCT_VARIANT_TITLE_MAX_LENGTH,
        }).notNull(),

        /**
         * Merchant SKU.
         *
         * Immutable business identifier.
         */
        sku: varchar("sku", {
            length: PRODUCT_VARIANT_SKU_MAX_LENGTH,
        }).notNull(),

        /**
         * Optional barcode.
         *
         * Examples:
         * - UPC
         * - EAN
         * - ISBN
         * - GTIN
         */
        barcode: varchar("barcode", {
            length: PRODUCT_VARIANT_BARCODE_MAX_LENGTH,
        }),

/**
 * ----------------------------------------------------------
 * Continue in Part 2...
 * ----------------------------------------------------------
 */

        /**
         * ----------------------------------------------------------
         * Presentation
         * ----------------------------------------------------------
         */

        /**
         * Controls variant ordering
         * inside product pages.
         */
        displayOrder: integer(
            "display_order",
        )
            .notNull()
            .default(0),

        /**
         * ----------------------------------------------------------
         * Variant State
         * ----------------------------------------------------------
         */

        /**
         * Variant lifecycle.
         */
        status: productVariantStatusEnum(
            "status",
        )
            .notNull()
            .default("ACTIVE"),

        /**
         * Indicates the default variant
         * selected when customers first
         * visit the product page.
         *
         * Only one default variant should
         * exist per product.
         *
         * This is enforced in the service layer
         * using a database transaction.
         */
        isDefault: boolean("is_default")
            .notNull()
            .default(false),

        /**
         * Determines whether this variant
         * can currently be purchased.
         *
         * Examples:
         *
         * • Inventory unavailable
         * • Manual pause
         * • Future launch
         * • Compliance restriction
         */
        isPurchasable: boolean(
            "is_purchasable",
        )
            .notNull()
            .default(true),

        /**
         * ----------------------------------------------------------
         * Business Flags
         * ----------------------------------------------------------
         */

        /**
         * Indicates whether this variant
         * requires shipping.
         *
         * Examples:
         * • Physical apparel → true
         * • Digital download → false
         */
        requiresShipping: boolean(
            "requires_shipping",
        )
            .notNull()
            .default(true),

        /**
         * Indicates whether this variant
         * is taxable.
         *
         * Tax calculation logic belongs
         * to the taxation module.
         */
        isTaxable: boolean("is_taxable")
            .notNull()
            .default(true),

        /**
         * Indicates whether this variant
         * is currently visible to buyers.
         *
         * Hidden variants remain available
         * internally without being displayed
         * on the storefront.
         */
        isVisible: boolean("is_visible")
            .notNull()
            .default(true),

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

        /**
         * Extensible variant metadata.
         *
         * Used for:
         * - Dimensions
         * - Weight
         * - AI metadata
         * - Future platform extensions
         */
        metadata: jsonb("metadata")
            .$type<ProductVariantMetadata>()
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

        /**
         * Null = Active
         *
         * Non-null = Soft Deleted
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
         * SKU must be unique within a product.
         *
         * Allows different products to reuse
         * merchant SKU patterns if desired.
         */
        productSkuUniqueIdx: uniqueIndex(
            "product_variants_product_sku_uidx",
        ).on(
            table.productId,
            table.sku,
        ),

        /**
         * Optional barcode.
         *
         * Multiple NULL values are allowed.
         */
        barcodeUniqueIdx: uniqueIndex(
            "product_variants_barcode_uidx",
        ).on(table.barcode),

        /**
         * ==========================================================
         * Product
         * ==========================================================
         */

        productIdx: index(
            "product_variants_product_idx",
        ).on(table.productId),

        productStatusIdx: index(
            "product_variants_product_status_idx",
        ).on(
            table.productId,
            table.status,
        ),

        productDisplayOrderIdx: index(
            "product_variants_product_display_order_idx",
        ).on(
            table.productId,
            table.displayOrder,
        ),

        defaultVariantIdx: index(
            "product_variants_default_idx",
        ).on(
            table.productId,
            table.isDefault,
        ),

        visibleVariantIdx: index(
            "product_variants_visible_idx",
        ).on(
            table.productId,
            table.isVisible,
        ),

        purchasableVariantIdx: index(
            "product_variants_purchasable_idx",
        ).on(
            table.productId,
            table.isPurchasable,
        ),

        /**
         * ==========================================================
         * Business Identity
         * ==========================================================
         */

        skuIdx: index(
            "product_variants_sku_idx",
        ).on(table.sku),

        /**
         * ==========================================================
         * Audit
         * ==========================================================
         */

        createdByIdx: index(
            "product_variants_created_by_idx",
        ).on(table.createdBy),

        updatedByIdx: index(
            "product_variants_updated_by_idx",
        ).on(table.updatedBy),

        /**
         * ==========================================================
         * Lifecycle
         * ==========================================================
         */

        createdAtIdx: index(
            "product_variants_created_at_idx",
        ).on(table.createdAt),

        deletedAtIdx: index(
            "product_variants_deleted_at_idx",
        ).on(table.deletedAt),

        /**
         * ==========================================================
         * Database Constraints
         * ==========================================================
         */

        titleNotEmptyCheck: check(
            "product_variants_title_not_empty_check",
            sql`length(trim(${table.title})) > 0`,
        ),

        skuNotEmptyCheck: check(
            "product_variants_sku_not_empty_check",
            sql`length(trim(${table.sku})) > 0`,
        ),

        displayOrderCheck: check(
            "product_variants_display_order_check",
            sql`${table.displayOrder} >= 0`,
        ),
    }),
);