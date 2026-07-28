import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { productSeoTable } from "./table";

/**
 * ============================================================
 * Product SEO Database Types
 * ============================================================
 */

export type ProductSeo =
    InferSelectModel<typeof productSeoTable>;

export type NewProductSeo =
    InferInsertModel<typeof productSeoTable>;

/**
 * Primary Key
 */

export type ProductSeoId =
    ProductSeo["id"];

/**
 * Public metadata exports.
 */

export type {
    ProductSeoMetadata,
    ProductSeoAiMetadata,
    ProductSeoImportMetadata,
    ProductSeoAnalyticsMetadata,
} from "./metadata";