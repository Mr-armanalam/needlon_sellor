import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { productsTable } from "./table";

/**
 * ============================================================
 * Product Database Types
 * ============================================================
 */

export type Product =
    InferSelectModel<typeof productsTable>;

export type NewProduct =
    InferInsertModel<typeof productsTable>;

/**
 * Primary Key
 */

export type ProductId = Product["id"];

/**
 * Public metadata exports.
 */

export type {
    ProductMetadata,
    ProductSeoMetadata,
    ProductAiMetadata,
    ProductBadgeMetadata,
    ProductCustomMetadata,
} from "./metadata";