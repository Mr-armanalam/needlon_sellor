import { z } from "zod";

import {
    cursorSchema,
    paginationSchema,
} from "./common.schema";

export const productSearchSchema =
    paginationSchema
        .merge(cursorSchema)
        .extend({
            query: z.string().optional(),

            categoryId: z.string().uuid().optional(),

            status: z.string().optional(),

            visibility: z.string().optional(),

            productType: z.string().optional(),
        });

export type ProductSearchInput =
    z.infer<typeof productSearchSchema>;