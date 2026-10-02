import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { productTagsTable } from "./table";

/**
 * ============================================================
 * Product Tag Database Types
 * ============================================================
 */

export type ProductTag =
    InferSelectModel<
        typeof productTagsTable
    >;

export type NewProductTag =
    InferInsertModel<
        typeof productTagsTable
    >;

/**
 * Primary Key
 */

export type ProductTagId =
    ProductTag["id"];

/**
 * Metadata exports
 */

export type {
    ProductTagMetadata,
    ProductTagAiMetadata,
    ProductTagAnalyticsMetadata,
    ProductTagImportMetadata,
} from "./metadata";