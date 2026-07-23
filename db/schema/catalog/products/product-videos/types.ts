import type {
    InferInsertModel,
    InferSelectModel,
} from "drizzle-orm";

import type { productVideosTable } from "./table";

/**
 * ============================================================
 * product-videos Database Types
 * ============================================================
 */

export type ProductVideo =
    InferSelectModel<typeof productVideosTable>;

export type NewProductVideo =
    InferInsertModel<typeof productVideosTable>;

/**
 * Primary Key
 */

export type ProductVideoId =
    ProductVideo["id"];

/**
 * Public metadata exports.
 */

export type {
    ProductVideoMetadata,
    ProductVideoAiMetadata,
    ProductVideoTranscriptMetadata,
    ProductVideoEncodingMetadata,
    ProductVideoCaptionMetadata,
    ProductVideoChapter,
} from "./metadata";