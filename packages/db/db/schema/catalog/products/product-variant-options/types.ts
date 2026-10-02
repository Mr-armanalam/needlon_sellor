import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { productVariantOptionsTable } from "./table";

/**
 * ============================================================
 * Product Variant Options Database Types
 * ============================================================
 */

export type ProductVariantOption =
    InferSelectModel<
        typeof productVariantOptionsTable
    >;

export type NewProductVariantOption =
    InferInsertModel<
        typeof productVariantOptionsTable
    >;

/**
 * Primary Key
 */

export type ProductVariantOptionId =
    ProductVariantOption["id"];

/**
 * Public metadata exports.
 */

export type {
    ProductVariantOptionMetadata,
    ProductVariantOptionImportMetadata,
    ProductVariantOptionAiMetadata,
} from "./metadata";