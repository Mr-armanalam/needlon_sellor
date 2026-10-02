import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { productImagesTable } from "./table";

/**
 * ============================================================
 * Product Images Database Types
 * ============================================================
 */

export type ProductImage =
    InferSelectModel<typeof productImagesTable>;

export type NewProductImage =
    InferInsertModel<typeof productImagesTable>;

/**
 * Primary Key
 */

export type ProductImageId =
    ProductImage["id"];

/**
 * Public metadata exports.
 */

export type {
    ProductImageMetadata,
    ProductImageAiMetadata,
    ProductImageCropMetadata,
    ProductImageFocalPointMetadata,
    ProductImageExifMetadata,
} from "./metadata";