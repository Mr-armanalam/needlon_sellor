import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { productTagMappingsTable } from "./table";

/**
 * ============================================================
 * Product Tag Mapping Database Types
 * ============================================================
 */

export type ProductTagMapping =
    InferSelectModel<
        typeof productTagMappingsTable
    >;

export type NewProductTagMapping =
    InferInsertModel<
        typeof productTagMappingsTable
    >;

/**
 * Primary Key
 */

export type ProductTagMappingId =
    ProductTagMapping["id"];

/**
 * Metadata exports
 */

export type {
    ProductTagMappingMetadata,
    ProductTagMappingImportMetadata,
    ProductTagMappingAiMetadata,
} from "./metadata";