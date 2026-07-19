
// import {
//     index,
//     integer,
//     pgTable,
//     text,
//     timestamp,
//     uniqueIndex,
//     uuid,
//     varchar,
//     boolean,
// } from "drizzle-orm/pg-core";
//
// import { catalogStatusEnum } from "../enums";
//
// export const categories = pgTable(
//     "categories",
//     {
//         id: uuid("id")
//             .defaultRandom()
//             .primaryKey(),
//
//         name: varchar("name", {
//             length: 120,
//         }).notNull(),
//
//         slug: varchar("slug", {
//             length: 150,
//         }).notNull(),
//
//         description: text(
//             "description",
//         ),
//
//         imageUrl: text(
//             "image_url",
//         ),
//
//         sortOrder: integer(
//             "sort_order",
//         )
//             .notNull()
//             .default(0),
//
//         status:
//             catalogStatusEnum(
//                 "status",
//             )
//                 .notNull()
//                 .default("ACTIVE"),
//
//         isFeatured: boolean(
//             "is_featured",
//         )
//             .notNull()
//             .default(false),
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
//     (table) => [
//         uniqueIndex(
//             "categories_slug_unique",
//         ).on(table.slug),
//
//         index(
//             "categories_name_idx",
//         ).on(table.name),
//
//         index(
//             "categories_sort_order_idx",
//         ).on(table.sortOrder),
//
//         index(
//             "categories_status_idx",
//         ).on(table.status),
//
//         index(
//             "categories_deleted_at_idx",
//         ).on(table.deletedAt),
//     ],
// );