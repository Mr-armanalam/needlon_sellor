import { z } from "zod";

export const productConfigSchema = z.object({
    NODE_ENV: z.enum([
        "development",
        "test",
        "production",
    ]),

    PRODUCT_MAX_IMAGES: z.coerce
        .number()
        .positive()
        .default(10),

    PRODUCT_MAX_VIDEO_SIZE_MB: z.coerce
        .number()
        .positive()
        .default(100),

    PRODUCT_MAX_IMAGE_SIZE_MB: z.coerce
        .number()
        .positive()
        .default(10),

    PRODUCT_DEFAULT_PAGE_SIZE: z.coerce
        .number()
        .positive()
        .default(20),

    PRODUCT_MAX_PAGE_SIZE: z.coerce
        .number()
        .positive()
        .default(100),

    PRODUCT_LOW_STOCK_THRESHOLD: z.coerce
        .number()
        .default(5),

    PRODUCT_DEFAULT_CURRENCY: z
        .string()
        .default("INR"),
});

export type ProductEnvironment =
    z.infer<typeof productConfigSchema>;