import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { productVariantsTable } from "./table";

/**
 * ============================================================
 * Product Variants Database Types
 * ============================================================
 */

export type ProductVariant =
    InferSelectModel<typeof productVariantsTable>;

export type NewProductVariant =
    InferInsertModel<typeof productVariantsTable>;

/**
 * Primary Key
 */

export type ProductVariantId =
    ProductVariant["id"];

/**
 * Public metadata exports.
 */

export type {
    ProductVariantMetadata,
    ProductVariantDimensionsMetadata,
    ProductVariantWeightMetadata,
    ProductVariantAiMetadata,
} from "./metadata";