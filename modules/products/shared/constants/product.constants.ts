export const PRODUCT_STATUS = {
    DRAFT: "draft",
    ACTIVE: "active",
    ARCHIVED: "archived",
    OUT_OF_STOCK: "out_of_stock",
} as const;

export const PRODUCT_VISIBILITY = {
    PUBLIC: "public",
    PRIVATE: "private",
    HIDDEN: "hidden",
} as const;

export const PRODUCT_LIMITS = {
    TITLE_MIN_LENGTH: 3,
    TITLE_MAX_LENGTH: 150,

    SHORT_DESCRIPTION_MAX_LENGTH: 500,

    DESCRIPTION_MAX_LENGTH: 10000,

    MAX_TAGS: 25,

    MAX_VARIANTS: 200,

    MAX_OPTIONS: 3,

    MAX_OPTION_VALUES: 100,
} as const;