// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/validation/update-conversation.schema.ts
// Description:
// Zod validation schema for updating an existing conversation.
// ============================================================================

import { z } from "zod";

export const updateConversationSchema =
    z
        .object({
            title: z
                .string()
                .trim()
                .min(1)
                .max(150)
                .optional(),

            description: z
                .string()
                .trim()
                .max(1000)
                .nullable()
                .optional(),

            avatarUrl: z
                .string()
                .trim()
                .url()
                .max(2048)
                .nullable()
                .optional(),

            isPinned: z
                .boolean()
                .optional(),

            isMuted: z
                .boolean()
                .optional(),

            isArchived: z
                .boolean()
                .optional(),
        })
        .refine(
            (value) =>
                Object.keys(value).length > 0,
            {
                message:
                    "At least one field must be provided for update.",
            },
        );