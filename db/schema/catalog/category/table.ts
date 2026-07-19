import {
    pgTable,
    uuid,
    varchar,
    text,
    integer,
    boolean,
    jsonb,
    timestamp,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";

import { usersTable } from "@/db/schema/users";
import { catalogStatusEnum } from "../enums";

export const categories = pgTable(
    "categories",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        name: varchar("name", {
            length: 150,
        }).notNull(),

        displayName: varchar("displayName", {
            length: 150,
        }),

        slug: varchar("slug", {
            length: 180,
        }).notNull(),

        description: text("description"),

        parentId: uuid("parent_id"),

        coverImagePath: text(
            "cover_image_path",
        ),

        coverImageUrl: text(
            "cover_image_url",
        ),

        status: catalogStatusEnum(
            "status",
        )
            .notNull()
            .default("ACTIVE"),

        sortOrder: integer(
            "sort_order",
        )
            .notNull()
            .default(0),

        level: integer("level")
            .notNull()
            .default(0),

        path: text("path")
            .notNull(),

        isFeatured: boolean(
            "is_featured",
        )
            .notNull()
            .default(false),

        isLeaf: boolean(),

        code: varchar("code", {
            length: 50,
        }).notNull(),

        isVisible: boolean(
            "is_visible",
        )
            .notNull()
            .default(true),

        metadata: jsonb("metadata"),

        createdBy: uuid(
            "created_by",
        ).references(
            () => usersTable.id,
            {
                onDelete: "set null",
            },
        ),

        updatedBy: uuid(
            "updated_by",
        ).references(
            () => usersTable.id,
            {
                onDelete: "set null",
            },
        ),

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

        deletedAt: timestamp(
            "deleted_at",
            {
                withTimezone: true,
            },
        ),
    },
    (table) => ({
        slugIdx: uniqueIndex(
            "categories_slug_idx",
        ).on(table.slug),

        parentIdx: index(
            "categories_parent_idx",
        ).on(table.parentId),

        statusIdx: index(
            "categories_status_idx",
        ).on(table.status),

        pathIdx: index(
            "categories_path_idx",
        ).on(table.path),

        levelIdx: index(
            "categories_level_idx",
        ).on(table.level),

        sortOrderIdx: index(
            "categories_sort_order_idx",
        ).on(table.sortOrder),

        deletedIdx: index(
            "categories_deleted_idx",
        ).on(table.deletedAt),
    }),
);
