// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/validation/update-message.schema.ts
// Description:
// Zod validation schema for updating an existing message.
// ============================================================================

import { z } from "zod";

/**
 * ============================================================================
 * Update Message Schema
 * ============================================================================
 */

export const updateMessageSchema =
    z
        .object({
            messageId: z
                .string()
                .uuid(),

            body: z
                .string()
                .trim()
                .min(1)
                .max(5000),

            keepAttachments: z
                .boolean()
                .optional(),

            updatedAt: z
                .string()
                .datetime()
                .optional(),
        });