// import {
//     pgTable,
//     uuid,
//     varchar,
//     text,
//     integer,
//     boolean,
//     jsonb,
//     timestamp,
//     index,
//     uniqueIndex, AnyPgColumn,
// } from "drizzle-orm/pg-core";
//
// import { catalogStatusEnum } from "../enums";
// import {seller} from "@/db/schema/seller";
//
// export const categoriesTable = pgTable(
//     "categories",
//     {
//         id: uuid("id")
//             .defaultRandom()
//             .primaryKey(),
//
//         name: varchar("name", {
//             length: 150,
//         }).notNull(),
//
//         slug: varchar("slug", {
//             length: 180,
//         }).notNull(),
//
//         description: text("description"),
//
//         parentId: uuid("parent_id").references(
//             (): AnyPgColumn => categoriesTable.id,
//             {
//                 onDelete: "restrict"
//             }
//         ),
//
//         imagePath: text(
//             "image_path",
//         ),
//
//         imageUrl: text(
//             "image_url",
//         ),
//
//         status: catalogStatusEnum(
//             "status",
//         )
//             .notNull()
//             .default("ACTIVE"),
//
//         sortOrder: integer(
//             "sort_order",
//         )
//             .notNull()
//             .default(0),
//
//         level: integer("level")
//             .notNull()
//             .default(0),
//
//         path: text("path")
//             .notNull(),
//
//         isFeatured: boolean(
//             "is_featured",
//         )
//             .notNull()
//             .default(false),
//
//         isLeaf: boolean(),
//
//         code: varchar("code", {
//             length: 50,
//         }).notNull(),
//
//         isVisible: boolean(
//             "is_visible",
//         )
//             .notNull()
//             .default(true),
//
//         metadata: jsonb("metadata"),
//         // metadata: jsonb("metadata").$type<CategoryMetadata>(),
//
//         createdBy: uuid(
//             "created_by",
//         ).references(
//             () => seller.id,
//             {
//                 onDelete: "set null",
//             },
//         ),
//
//         updatedBy: uuid(
//             "updated_by",
//         ).references(
//             () => seller.id,
//             {
//                 onDelete: "set null",
//             },
//         ),
//
//         createdAt: timestamp(
//             "created_at",
//             {
//                 withTimezone: true,
//             },
//         )
//             .defaultNow()
//             .notNull(),
//
//         updatedAt: timestamp(
//             "updated_at",
//             {
//                 withTimezone: true,
//             },
//         )
//             .defaultNow()
//             .notNull(),
//
//         deletedAt: timestamp(
//             "deleted_at",
//             {
//                 withTimezone: true,
//             },
//         ),
//     },
//     (table) => ({
//         slugIdx: uniqueIndex(
//             "categories_slug_idx",
//         ).on(table.slug),
//
//         parentIdx: index(
//             "categories_parent_idx",
//         ).on(table.parentId),
//
//         statusIdx: index(
//             "categories_status_idx",
//         ).on(table.status),
//
//         pathIdx: index(
//             "categories_path_idx",
//         ).on(table.path),
//
//         levelIdx: index(
//             "categories_level_idx",
//         ).on(table.level),
//
//         sortOrderIdx: index(
//             "categories_sort_order_idx",
//         ).on(table.sortOrder),
//
//         deletedIdx: index(
//             "categories_deleted_idx",
//         ).on(table.deletedAt),
//     }),
// );


import { sql } from "drizzle-orm";
import {
    AnyPgColumn,
    boolean,
    check,
    index,
    jsonb,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
    integer,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import {
    catalogStatusEnum,
    categoryVisibilityEnum,
} from "../enums";

import type { CategoryMetadata } from "./metadata";

import {
    CATEGORY_CODE_MAX_LENGTH,
    CATEGORY_DEFAULT_LEVEL,
    CATEGORY_DEFAULT_SORT_ORDER,
    CATEGORY_NAME_MAX_LENGTH,
    CATEGORY_SLUG_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================
 * Categories
 * ============================================================
 *
 * Root catalog hierarchy.
 *
 * Uses:
 *
 * Adjacency List
 * +
 * Materialized Path
 *
 * Example
 *
 * Women
 *   ├── Ethnic Wear
 *   │      └── Sarees
 *   │
 *   └── Western Wear
 *
 * ============================================================
 */

export const categoriesTable = pgTable(
    "categories",
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
         * Naming
         * ----------------------------------------------------------
         */

        name: varchar("name", {
            length: CATEGORY_NAME_MAX_LENGTH,
        }).notNull(),

        slug: varchar("slug", {
            length: CATEGORY_SLUG_MAX_LENGTH,
        }).notNull(),

        code: varchar("code", {
            length: CATEGORY_CODE_MAX_LENGTH,
        }).notNull(),

        description: text("description"),

        /**
         * ----------------------------------------------------------
         * Hierarchy
         * ----------------------------------------------------------
         */

        parentId: uuid("parent_id").references(
            (): AnyPgColumn => categoriesTable.id,
            {
                onDelete: "restrict",
            },
        ),

        /**
         * Materialized path.
         *
         * Example:
         *
         * /women
         *
         * /women/ethnic-wear
         *
         * /women/ethnic-wear/sarees
         */
        path: text("path").notNull(),

        /**
         * Root = 0
         */
        level: integer("level")
            .notNull()
            .default(CATEGORY_DEFAULT_LEVEL),

        /**
         * Cached flag.
         *
         * Maintained by service layer.
         */
        isLeaf: boolean("is_leaf")
            .notNull()
            .default(true),

        /**
         * UI ordering.
         */
        sortOrder: integer("sort_order")
            .notNull()
            .default(CATEGORY_DEFAULT_SORT_ORDER),

        /**
         * ----------------------------------------------------------
         * Business
         * ----------------------------------------------------------
         */

        status: catalogStatusEnum("status")
            .notNull()
            .default("ACTIVE"),

        visibility: categoryVisibilityEnum(
            "visibility",
        )
            .notNull()
            .default("PUBLIC"),

        /**
         * Homepage / Landing page
         */
        isFeatured: boolean("is_featured")
            .notNull()
            .default(false),

        /**
         * Temporary visibility toggle.
         *
         * Different from visibility enum.
         */
        isVisible: boolean("is_visible")
            .notNull()
            .default(true),

/**
 * ----------------------------------------------------------
 * Metadata
 * ----------------------------------------------------------
 *
 * Continue in Part 2...
 */

metadata: jsonb("metadata")
    .$type<CategoryMetadata>()
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
         * Soft delete.
         */
        deletedAt: timestamp("deleted_at", {
            withTimezone: true,
        }),
    },

    /**
     * ----------------------------------------------------------
     * Indexes
     * ----------------------------------------------------------
     */

    (table) => ({
        /**
         * -------------------------
         * Unique
         * -------------------------
         */

        slugIdx: uniqueIndex(
            "categories_slug_idx",
        ).on(table.slug),

        codeIdx: uniqueIndex(
            "categories_code_idx",
        ).on(table.code),

        /**
         * -------------------------
         * Hierarchy
         * -------------------------
         */

        parentIdx: index(
            "categories_parent_idx",
        ).on(table.parentId),

        pathIdx: index("categories_parent_sort_idx").on(
            table.parentId,
            table.sortOrder,
        ),

        levelIdx: index(
            "categories_level_idx",
        ).on(table.level),

        /**
         * -------------------------
         * Business
         * -------------------------
         */

        statusIdx: index(
            "categories_status_idx",
        ).on(table.status),

        visibilityIdx: index(
            "categories_visibility_idx",
        ).on(table.visibility),

        featuredIdx: index("categories_featured_sort_idx").on(
            table.isFeatured,
            table.sortOrder,
        ),

        visibleIdx: index(
            "categories_visible_idx",
        ).on(table.isVisible),

        sortOrderIdx: index(
            "categories_sort_order_idx",
        ).on(table.sortOrder),

        /**
         * -------------------------
         * Audit
         * -------------------------
         */

        createdByIdx: index(
            "categories_created_by_idx",
        ).on(table.createdBy),

        updatedByIdx: index(
            "categories_updated_by_idx",
        ).on(table.updatedBy),

        deletedAtIdx: index("categories_status_deleted_idx").on(
            table.status,
            table.deletedAt,
        ),


        //
        // deletedAtIdx: index(
        //     "categories_deleted_at_idx",
        // ).on(table.deletedAt),



        /**
         * -------------------------
         * Database Constraints
         * -------------------------
         */

        levelCheck: check(
            "categories_level_check",
            sql`${table.level} >= 0`,
        ),

        sortOrderCheck: check(
            "categories_sort_order_check",
            sql`${table.sortOrder} >= 0`,
        ),
    }),
);