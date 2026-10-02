import { sql } from "drizzle-orm";
import {
    AnyPgColumn,
    boolean,
    check,
    index,
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import { categoriesTable } from "../categories";

import {
    attributeDataTypeEnum,
    attributeInputTypeEnum,
    catalogStatusEnum,
} from "../enums";

import type { CategoryAttributeMetadata } from "./metadata";

import {
    ATTRIBUTE_DEFAULT_DISPLAY_ORDER,
    ATTRIBUTE_DESCRIPTION_MAX_LENGTH,
    ATTRIBUTE_GROUP_MAX_LENGTH,
    ATTRIBUTE_HELPER_TEXT_MAX_LENGTH,
    ATTRIBUTE_KEY_MAX_LENGTH,
    ATTRIBUTE_NAME_MAX_LENGTH,
    ATTRIBUTE_PLACEHOLDER_MAX_LENGTH,
    ATTRIBUTE_SLUG_MAX_LENGTH,
    ATTRIBUTE_UNIT_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================
 * Category Attributes
 * ============================================================
 *
 * Defines dynamic fields for a category.
 *
 * Examples
 * --------
 *
 * Category
 * Women > Sarees
 *
 * Attributes
 *
 * Color
 * Fabric
 * Occasion
 * Pattern
 * Sleeve Length
 *
 * Product values are stored separately.
 *
 * ============================================================
 */

export const categoryAttributesTable = pgTable(
    "category_attributes",
    {
        /**
         * ----------------------------------------------------------
         * Identity
         * ----------------------------------------------------------
         */

        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        categoryId: uuid("category_id")
            .notNull()
            .references(
                (): AnyPgColumn => categoriesTable.id,
                {
                    onDelete: "cascade",
                },
            ),

        /**
         * ----------------------------------------------------------
         * Naming
         * ----------------------------------------------------------
         */

        /**
         * Immutable internal identifier.
         *
         * Example:
         *
         * color
         * fabric
         * sleeve_length
         */
        attributeKey: varchar("attribute_key", {
            length: ATTRIBUTE_KEY_MAX_LENGTH,
        }).notNull(),

        /**
         * User visible label.
         */
        name: varchar("name", {
            length: ATTRIBUTE_NAME_MAX_LENGTH,
        }).notNull(),

        slug: varchar("slug", {
            length: ATTRIBUTE_SLUG_MAX_LENGTH,
        }).notNull(),

        description: varchar("description", {
            length: ATTRIBUTE_DESCRIPTION_MAX_LENGTH,
        }),

        /**
         * ----------------------------------------------------------
         * Type
         * ----------------------------------------------------------
         */

        inputType: attributeInputTypeEnum(
            "input_type",
        ).notNull(),

        dataType: attributeDataTypeEnum(
            "data_type",
        ).notNull(),

        /**
         * ----------------------------------------------------------
         * Validation
         * ----------------------------------------------------------
         */

        isRequired: boolean("is_required")
            .notNull()
            .default(false),

        isFilterable: boolean("is_filterable")
            .notNull()
            .default(false),

        isSearchable: boolean("is_searchable")
            .notNull()
            .default(false),

        isComparable: boolean("is_comparable")
            .notNull()
            .default(false),

        isVariantAttribute: boolean(
            "is_variant_attribute",
        )
            .notNull()
            .default(false),

        /**
         * ----------------------------------------------------------
         * Business
         * ----------------------------------------------------------
         */

        /**
         * Platform owned attribute.
         */
        systemDefined: boolean("system_defined")
            .notNull()
            .default(true),

        status: catalogStatusEnum("status")
            .notNull()
            .default("ACTIVE"),

        /**
         * ----------------------------------------------------------
         * UI
         * ----------------------------------------------------------
         */

        displayOrder: integer("display_order")
            .notNull()
            .default(
                ATTRIBUTE_DEFAULT_DISPLAY_ORDER,
            ),

        /**
         * Display on:
         *
         * Product Cards
         * Search Results
         * Collection Grid
         */
        showOnListing: boolean(
            "show_on_listing",
        )
            .notNull()
            .default(false),

        placeholder: varchar("placeholder", {
            length: ATTRIBUTE_PLACEHOLDER_MAX_LENGTH,
        }),

        helperText: varchar("helper_text", {
            length: ATTRIBUTE_HELPER_TEXT_MAX_LENGTH,
        }),

        /**
         * Example
         *
         * cm
         * inch
         * kg
         */
        unit: varchar("unit", {
            length: ATTRIBUTE_UNIT_MAX_LENGTH,
        }),

        /**
         * Optional UI grouping.
         *
         * Example:
         *
         * Basic Information
         * Specifications
         * Shipping
         */
        attributeGroup: varchar("attribute_group", {
            length: ATTRIBUTE_GROUP_MAX_LENGTH,
        }),

/**
 * ----------------------------------------------------------
 * Metadata
 * ----------------------------------------------------------
 *
 * Continue in Part 2...
 */

metadata: jsonb("metadata")
    .$type<CategoryAttributeMetadata>()
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

        deletedAt: timestamp("deleted_at", {
            withTimezone: true,
        }),
    },
    (table) => ({
        /**
         * ----------------------------------------------------------
         * Unique Constraints
         * ----------------------------------------------------------
         */

        categoryAttributeKeyUniqueIdx: uniqueIndex(
            "category_attributes_category_attribute_key_uidx",
        ).on(
            table.categoryId,
            table.attributeKey,
        ),

        categorySlugUniqueIdx: uniqueIndex(
            "category_attributes_category_slug_uidx",
        ).on(
            table.categoryId,
            table.slug,
        ),

        /**
         * ----------------------------------------------------------
         * Foreign Keys
         * ----------------------------------------------------------
         */

        categoryIdx: index(
            "category_attributes_category_idx",
        ).on(table.categoryId),

        /**
         * ----------------------------------------------------------
         * Display
         * ----------------------------------------------------------
         */

        categoryDisplayOrderIdx: index(
            "category_attributes_category_display_order_idx",
        ).on(
            table.categoryId,
            table.displayOrder,
        ),

        /**
         * ----------------------------------------------------------
         * Search & Filtering
         * ----------------------------------------------------------
         */

        categoryFilterableIdx: index(
            "category_attributes_category_filterable_idx",
        ).on(
            table.categoryId,
            table.isFilterable,
        ),

        categorySearchableIdx: index(
            "category_attributes_category_searchable_idx",
        ).on(
            table.categoryId,
            table.isSearchable,
        ),

        categoryVariantIdx: index(
            "category_attributes_category_variant_idx",
        ).on(
            table.categoryId,
            table.isVariantAttribute,
        ),

        categoryListingIdx: index(
            "category_attributes_category_listing_idx",
        ).on(
            table.categoryId,
            table.showOnListing,
        ),

        /**
         * ----------------------------------------------------------
         * Status
         * ----------------------------------------------------------
         */

        categoryStatusDeletedIdx: index(
            "category_attributes_category_status_deleted_idx",
        ).on(
            table.categoryId,
            table.status,
            table.deletedAt,
        ),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdByIdx: index(
            "category_attributes_created_by_idx",
        ).on(table.createdBy),

        updatedByIdx: index(
            "category_attributes_updated_by_idx",
        ).on(table.updatedBy),

        deletedAtIdx: index(
            "category_attributes_deleted_at_idx",
        ).on(table.deletedAt),

        /**
         * ----------------------------------------------------------
         * Database Constraints
         * ----------------------------------------------------------
         */

        displayOrderCheck: check(
            "category_attributes_display_order_check",
            sql`${table.displayOrder} >= 0`,
        ),
    }),
);