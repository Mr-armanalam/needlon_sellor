import { z } from "zod";

export const duplicateProductSchema =
    z.object({
        productId: z.uuid(),

        includeImages: z
            .boolean()
            .default(true),

        includeVariants: z
            .boolean()
            .default(true),
    });

export type DuplicateProductSchema =
    z.infer<
        typeof duplicateProductSchema
    >;