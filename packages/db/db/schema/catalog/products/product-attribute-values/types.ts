import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { productAttributeValuesTable } from "./table";

/**
 * ============================================================
 * Product Attribute Values Database Types
 * ============================================================
 */

export type ProductAttributeValue =
    InferSelectModel<
        typeof productAttributeValuesTable
    >;

export type NewProductAttributeValue =
    InferInsertModel<
        typeof productAttributeValuesTable
    >;

/**
 * Primary Key
 */

export type ProductAttributeValueId =
    ProductAttributeValue["id"];

/**
 * Public metadata exports.
 */

export type {
    ProductAttributeValueMetadata,
    ProductAttributeValueImportMetadata,
    ProductAttributeValueAiMetadata,
} from "./metadata";