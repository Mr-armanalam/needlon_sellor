import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { categoryAttributesTable } from "./table";

/**
 * ============================================================
 * Category Attribute Database Types
 * ============================================================
 */

export type CategoryAttribute =
    InferSelectModel<
        typeof categoryAttributesTable
    >;

export type NewCategoryAttribute =
    InferInsertModel<
        typeof categoryAttributesTable
    >;

/**
 * Primary Key
 */

export type CategoryAttributeId =
    CategoryAttribute["id"];

/**
 * Public metadata export.
 */

export type {
    CategoryAttributeMetadata,
    AttributeValidationMetadata,
    AttributeUiMetadata,
    AttributeAiMetadata,
} from "./metadata";