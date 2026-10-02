import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { productAiTable } from "./table";

/**
 * ============================================================
 * Product AI Database Types
 * ============================================================
 */

export type ProductAi =
    InferSelectModel<
        typeof productAiTable
    >;

export type NewProductAi =
    InferInsertModel<
        typeof productAiTable
    >;

/**
 * Primary Key
 */

export type ProductAiId =
    ProductAi["id"];

/**
 * Metadata exports
 */

export type {
    ProductAiMetadata,
    ProductAiPromptMetadata,
    ProductAiUsageMetadata,
    ProductAiConfidenceMetadata,
} from "./metadata";