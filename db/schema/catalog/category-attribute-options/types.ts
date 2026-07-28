import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { categoryAttributeOptionsTable } from "./table";

/**
 * ============================================================
 * Category Attribute Option Database Types
 * ============================================================
 */

export type CategoryAttributeOption =
    InferSelectModel<
        typeof categoryAttributeOptionsTable
    >;

export type NewCategoryAttributeOption =
    InferInsertModel<
        typeof categoryAttributeOptionsTable
    >;

/**
 * Primary Key
 */

export type CategoryAttributeOptionId =
    CategoryAttributeOption["id"];

/**
 * Public metadata exports.
 */

export type {
    CategoryAttributeOptionMetadata,
    AttributeOptionUiMetadata,
    AttributeOptionAiMetadata,
} from "./metadata";