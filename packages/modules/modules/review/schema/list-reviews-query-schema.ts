// ============================================================================
// Needlon
// Reviews Module
// File: modules/reviews/validation/list-reviews-query-schema.ts
// Description: Seller review list query validation
// Phase: 4.3
// ============================================================================

import { z } from "zod";

export const listReviewsQuerySchema =
    z.object({
        page: z
            .coerce
            .number()
            .int()
            .min(1)
            .default(1),

        limit: z
            .coerce
            .number()
            .int()
            .min(1)
            .max(100)
            .default(20),

        search: z
            .string()
            .trim()
            .max(255)
            .optional(),

        rating: z
            .coerce
            .number()
            .int()
            .min(1)
            .max(5)
            .optional(),
    });