import { pgEnum } from "drizzle-orm/pg-core";

export const catalogStatusEnum = pgEnum("catalog_status", [
    "ACTIVE",
    "INACTIVE",
    "ARCHIVED",
]);

export const attributeInputTypeEnum = pgEnum("attribute_input_type", [
    "TEXT",
    "TEXTAREA",
    "NUMBER",
    "DECIMAL",
    "BOOLEAN",
    "DATE",
    "SELECT",
    "MULTI_SELECT",
]);

export const attributeDataTypeEnum = pgEnum("attribute_data_type", [
    "STRING",
    "INTEGER",
    "DECIMAL",
    "BOOLEAN",
    "DATE",
    "JSON",
]);

export const categoryVisibilityEnum = pgEnum("category_visibility", [
    "PUBLIC",
    "PRIVATE",
]);

export const categoryImageTypeEnum = pgEnum("category_image_type", [
    "COVER",
    "BANNER",
    "ICON",
]);

export const attributeOptionStatusEnum = pgEnum("attribute_option_status", [
    "ACTIVE",
    "INACTIVE",
]);


/**
 * ============================================================
 * Product Status
 * ============================================================
 *
 * Internal product lifecycle.
 *
 * Controlled by seller and platform moderation.
 */

export const productStatusEnum = pgEnum(
    "product_status",
    [
        "DRAFT",
        "PENDING_REVIEW",
        "CHANGES_REQUESTED",
        "APPROVED",
        "PUBLISHED",
        "SUSPENDED",
        "REJECTED",
        "ARCHIVED",
    ],
);

/**
 * ============================================================
 * Product Visibility
 * ============================================================
 *
 * Controls customer visibility.
 *
 * Independent from moderation status.
 */

export const productVisibilityEnum = pgEnum(
    "product_visibility",
    [
        "PUBLIC",
        "PRIVATE",
        "UNLISTED",
    ],
);

/**
 * ============================================================
 * Product Type
 * ============================================================
 *
 * Determines downstream business logic.
 */

export const productTypeEnum = pgEnum(
    "product_type",
    [
        "PHYSICAL",
        "DIGITAL",
        "SERVICE",
        "GIFT_CARD",
    ],
);

/**
 * ============================================================
 * Product Image Status
 * ============================================================
 *
 * Image lifecycle.
 */

export const productImageStatusEnum = pgEnum(
    "product_image_status",
    [
        "ACTIVE",
        "INACTIVE",
        "ARCHIVED",
    ],
);

/**
 * ============================================================
 * Product Image Type
 * ============================================================
 *
 * Image purpose inside a product gallery.
 */

export const productImageTypeEnum = pgEnum(
    "product_image_type",
    [
        "GALLERY",
        "THUMBNAIL",
        "COVER",
        "DETAIL",
    ],
);

/**
 * ============================================================
 * Product Image Storage Provider
 * ============================================================
 *
 * Physical storage backend.
 *
 * Allows migration between providers
 * without schemas changes.
 */

export const productImageStorageProviderEnum =
    pgEnum(
        "product_image_storage_provider",
        [
            "SUPABASE",
            "S3",
            "CLOUDINARY",
            "R2",
            "LOCAL",
            "CUSTOM",
        ],
    );

/**
 * ============================================================
 * Product Video Status
 * ============================================================
 */

export const productVideoStatusEnum = pgEnum(
    "product_video_status",
    [
        "ACTIVE",
        "INACTIVE",
        "ARCHIVED",
    ],
);

/**
 * ============================================================
 * Product Video Type
 * ============================================================
 *
 * Business purpose of the video.
 */

export const productVideoTypeEnum = pgEnum(
    "product_video_type",
    [
        "GALLERY",
        "DEMO",
        "TUTORIAL",
        "PROMOTIONAL",
    ],
);

/**
 * ============================================================
 * Product Video Storage Provider
 * ============================================================
 */

export const productVideoStorageProviderEnum =
    pgEnum(
        "product_video_storage_provider",
        [
            "SUPABASE",
            "S3",
            "CLOUDINARY",
            "MUX",
            "R2",
            "LOCAL",
            "CUSTOM",
        ],
    );

/**
 * ============================================================
 * Product Variant Status
 * ============================================================
 *
 * Lifecycle of a product variant.
 */

export const productVariantStatusEnum = pgEnum(
    "product_variant_status",
    [
        "ACTIVE",
        "INACTIVE",
        "ARCHIVED",
    ],
);


/**
 * ============================================================
 * Weight Unit
 * ============================================================
 */

export const weightUnitEnum = pgEnum(
    "weight_unit",
    [
        "KG",
        "G",
        "LB",
        "OZ",
    ],
);

/**
 * ============================================================
 * Dimension Unit
 * ============================================================
 */

export const dimensionUnitEnum = pgEnum(
    "dimension_unit",
    [
        "CM",
        "MM",
        "IN",
    ],
);

/**
 * ============================================================
 * Shipping Class
 * ============================================================
 */

export const shippingClassEnum = pgEnum(
    "shipping_class",
    [
        "STANDARD",
        "EXPRESS",
        "HEAVY",
        "OVERSIZED",
        "COLD_CHAIN",
        "CUSTOM",
    ],
);

/**
 * ============================================================
 * Robots Directive
 * ============================================================
 *
 * Controls search engine indexing behaviour.
 */

export const robotsDirectiveEnum = pgEnum(
    "robots_directive",
    [
        "INDEX_FOLLOW",
        "INDEX_NOFOLLOW",
        "NOINDEX_FOLLOW",
        "NOINDEX_NOFOLLOW",
    ],
);


/**
 * ============================================================
 * Product AI Enums
 * ============================================================
 */

/**
 * AI moderation lifecycle.
 */
export const aiModerationStatusEnum = pgEnum(
    "ai_moderation_status",
    [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "FLAGGED",
    ],
);