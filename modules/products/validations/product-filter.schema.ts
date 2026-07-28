import { z } from "zod";

export const productFilterSchema =
    z.object({
        categoryId: z
            .uuid()
            .optional(),

        brandId: z
            .uuid()
            .optional(),

        status: z
            .string()
            .optional(),

        hasVariants: z
            .coerce
            .boolean()
            .optional(),

        minPrice: z
            .coerce
            .number()
            .min(0)
            .optional(),

        maxPrice: z
            .coerce
            .number()
            .min(0)
            .optional(),
    });

export type ProductFilterSchema =
    z.infer<
        typeof productFilterSchema
    >;