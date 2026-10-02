import { z } from "zod";

export const catalogMetaSchema =
    z.object({

        metaTitle:
            z.string().optional(),

        metaDescription:
            z.string().optional(),

        keywords:
            z.array(z.string())
                .default([]),

    });