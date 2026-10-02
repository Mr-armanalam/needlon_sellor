import {
    productConfigSchema,
} from "./product.config.schema";

const parsed =
    productConfigSchema.parse({
        NODE_ENV: process.env.NODE_ENV,

        PRODUCT_MAX_IMAGES:
        process.env.PRODUCT_MAX_IMAGES,

        PRODUCT_MAX_VIDEO_SIZE_MB:
        process.env.PRODUCT_MAX_VIDEO_SIZE_MB,

        PRODUCT_MAX_IMAGE_SIZE_MB:
        process.env.PRODUCT_MAX_IMAGE_SIZE_MB,

        PRODUCT_DEFAULT_PAGE_SIZE:
        process.env.PRODUCT_DEFAULT_PAGE_SIZE,

        PRODUCT_MAX_PAGE_SIZE:
        process.env.PRODUCT_MAX_PAGE_SIZE,

        PRODUCT_LOW_STOCK_THRESHOLD:
        process.env.PRODUCT_LOW_STOCK_THRESHOLD,

        PRODUCT_DEFAULT_CURRENCY:
        process.env.PRODUCT_DEFAULT_CURRENCY,
    });

export const productConfig = {

    environment: parsed.NODE_ENV,

    media: {

        maxImages:
        parsed.PRODUCT_MAX_IMAGES,

        maxVideoSizeMb:
        parsed.PRODUCT_MAX_VIDEO_SIZE_MB,

        maxImageSizeMb:
        parsed.PRODUCT_MAX_IMAGE_SIZE_MB,
    },

    pagination: {

        defaultPageSize:
        parsed.PRODUCT_DEFAULT_PAGE_SIZE,

        maxPageSize:
        parsed.PRODUCT_MAX_PAGE_SIZE,
    },

    inventory: {

        lowStockThreshold:
        parsed.PRODUCT_LOW_STOCK_THRESHOLD,
    },

    pricing: {

        currency:
        parsed.PRODUCT_DEFAULT_CURRENCY,
    },
} as const;