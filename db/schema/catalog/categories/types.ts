import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { categoriesTable } from "./table";

import type { CategoryMetadata } from "./metadata";

/**
 * ============================================================
 * Category Database Types
 * ============================================================
 */

export type Category = InferSelectModel<
    typeof categoriesTable
>;

export type NewCategory =
    InferInsertModel<
        typeof categoriesTable
    >;

/**
 * Convenience aliases.
 */

export type CategoryId = Category["id"];

export type CategoryParentId =
    Category["parentId"];

/**
 * Metadata alias.
 */

export type { CategoryMetadata };