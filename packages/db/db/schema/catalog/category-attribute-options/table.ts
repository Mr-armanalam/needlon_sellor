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

import { categoryAttributesTable } from "../category-attributes";

import {
    catalogStatusEnum,
} from "../enums";

import type { CategoryAttributeOptionMetadata } from "./metadata";

import {
    ATTRIBUTE_OPTION_COLOR_HEX_MAX_LENGTH,
    ATTRIBUTE_OPTION_DEFAULT_DISPLAY_ORDER,
    ATTRIBUTE_OPTION_DESCRIPTION_MAX_LENGTH,
    ATTRIBUTE_OPTION_ICON_URL_MAX_LENGTH,
    ATTRIBUTE_OPTION_IMAGE_URL_MAX_LENGTH,
    ATTRIBUTE_OPTION_LABEL_MAX_LENGTH,
    ATTRIBUTE_OPTION_VALUE_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================
 * Category Attribute Options
 * ============================================================
 *
 * Stores predefined selectable values for an attribute.
 *
 * Examples
 * --------
 *
 * Attribute
 * ---------
 * Color
 *
 * Options
 * -------
 * Red
 * Blue
 * Black
 * Green
 *
 * Product values are stored separately.
 *
 * ============================================================
 */

export const categoryAttributeOptionsTable = pgTable(
    "category_attribute_options",
    {
        /**
         * ----------------------------------------------------------
         * Identity
         * ----------------------------------------------------------
         */

        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        attributeId: uuid("attribute_id")
            .notNull()
            .references(
                (): AnyPgColumn =>
                    categoryAttributesTable.id,
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
         * User visible value.
         *
         * Example:
         *
         * Red
         * XL
         * Cotton
         */
        label: varchar("label", {
            length: ATTRIBUTE_OPTION_LABEL_MAX_LENGTH,
        }).notNull(),

        /**
         * Stable internal value.
         *
         * Example:
         *
         * red
         * xl
         * cotton
         */
        value: varchar("value", {
            length: ATTRIBUTE_OPTION_VALUE_MAX_LENGTH,
        }).notNull(),

        description: varchar("description", {
            length: ATTRIBUTE_OPTION_DESCRIPTION_MAX_LENGTH,
        }),

        /**
         * ----------------------------------------------------------
         * Presentation
         * ----------------------------------------------------------
         */

        displayOrder: integer("display_order")
            .notNull()
            .default(
                ATTRIBUTE_OPTION_DEFAULT_DISPLAY_ORDER,
            ),

        /**
         * Example:
         *
         * #FF0000
         */
        colorHex: varchar("color_hex", {
            length: ATTRIBUTE_OPTION_COLOR_HEX_MAX_LENGTH,
        }),

        /**
         * Optional swatch / thumbnail.
         */
        imageUrl: varchar("image_url", {
            length: ATTRIBUTE_OPTION_IMAGE_URL_MAX_LENGTH,
        }),

        /**
         * Optional icon.
         */
        iconUrl: varchar("icon_url", {
            length: ATTRIBUTE_OPTION_ICON_URL_MAX_LENGTH,
        }),

        /**
         * ----------------------------------------------------------
         * Business
         * ----------------------------------------------------------
         */

        /**
         * Default option for this attribute.
         */
        isDefault: boolean("is_default")
            .notNull()
            .default(false),

        /**
         * Platform managed option.
         */
        systemDefined: boolean("system_defined")
            .notNull()
            .default(true),

        status: catalogStatusEnum("status")
            .notNull()
            .default("ACTIVE"),

/**
 * ----------------------------------------------------------
 * Metadata
 * ----------------------------------------------------------
 *
 * Continue in Part 2...
 */

metadata: jsonb("metadata")
    .$type<CategoryAttributeOptionMetadata>()
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
         * Soft delete timestamp.
         */
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

        attributeValueUniqueIdx: uniqueIndex(
            "category_attribute_options_attribute_value_uidx",
        ).on(
            table.attributeId,
            table.value,
        ),

        attributeLabelUniqueIdx: uniqueIndex(
            "category_attribute_options_attribute_label_uidx",
        ).on(
            table.attributeId,
            table.label,
        ),

        /**
         * ----------------------------------------------------------
         * Foreign Key
         * ----------------------------------------------------------
         */

        attributeIdx: index(
            "category_attribute_options_attribute_idx",
        ).on(table.attributeId),

        /**
         * ----------------------------------------------------------
         * Display
         * ----------------------------------------------------------
         */

        attributeDisplayOrderIdx: index(
            "category_attribute_options_attribute_display_order_idx",
        ).on(
            table.attributeId,
            table.displayOrder,
        ),

        /**
         * ----------------------------------------------------------
         * Business
         * ----------------------------------------------------------
         */

        attributeStatusDeletedIdx: index(
            "category_attribute_options_attribute_status_deleted_idx",
        ).on(
            table.attributeId,
            table.status,
            table.deletedAt,
        ),

        systemDefinedIdx: index(
            "category_attribute_options_system_defined_idx",
        ).on(table.systemDefined),

        defaultOptionIdx: index(
            "category_attribute_options_default_idx",
        ).on(
            table.attributeId,
            table.isDefault,
        ),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdByIdx: index(
            "category_attribute_options_created_by_idx",
        ).on(table.createdBy),

        updatedByIdx: index(
            "category_attribute_options_updated_by_idx",
        ).on(table.updatedBy),

        deletedAtIdx: index(
            "category_attribute_options_deleted_at_idx",
        ).on(table.deletedAt),

        /**
         * ----------------------------------------------------------
         * Database Constraints
         * ----------------------------------------------------------
         */

        displayOrderCheck: check(
            "category_attribute_options_display_order_check",
            sql`${table.displayOrder} >= 0`,
        ),
    }),
);