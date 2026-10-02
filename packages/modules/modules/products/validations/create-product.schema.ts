import { z } from "zod";

import {
    categoryIdSchema,
    metadataSchema,
    skuSchema,
    slugSchema,
    storeIdSchema,
} from "./common.schema";

export const createProductSchema = z.object({
    storeId: storeIdSchema,

    categoryId: categoryIdSchema,

    name: z
        .string()
        .trim()
        .min(2)
        .max(255),

    slug: slugSchema.optional(),

    sku: skuSchema.optional(),

    brand: z
        .string()
        .trim()
        .max(255)
        .optional(),

    model: z
        .string()
        .trim()
        .max(255)
        .optional(),

    hsnCode: z
        .string()
        .trim()
        .max(50)
        .optional(),

    countryOfOrigin: z
        .string()
        .trim()
        .max(100)
        .optional(),

    shortDescription: z
        .string()
        .trim()
        .max(500)
        .optional(),

    description: z
        .string()
        .trim()
        .optional(),

    warranty: z
        .string()
        .trim()
        .max(255)
        .optional(),

    productType: z.string(),

    visibility: z.string(),

    status: z.string().optional(),

    isFeatured: z.boolean().default(false),

    isAvailable: z.boolean().default(true),

    sortOrder: z.number().int().default(0),

    metadata: metadataSchema.optional(),
});

export type CreateProductInput =
    z.infer<typeof createProductSchema>;