// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/validation/create-conversation.schema.ts
// Description:
// Zod validation schema for creating a new conversation.
// ============================================================================

import { z } from "zod";

import {
    CONVERSATION_TYPES,
} from "@/db/schema/messages";

const createConversationMemberSchema =
    z.object({
        sellerId: z
            .string()
            .uuid(),

        isAdmin: z
            .boolean()
            .optional(),
    });

export const createConversationSchema =
    z
        .object({
            type: z.enum(
                CONVERSATION_TYPES,
            ),

            title: z
                .string()
                .trim()
                .min(1)
                .max(150)
                .nullable(),

            description: z
                .string()
                .trim()
                .max(1000)
                .nullable(),

            avatarUrl: z
                .string()
                .trim()
                .url()
                .max(2048)
                .nullable(),

            members: z
                .array(
                    createConversationMemberSchema,
                )
                .min(1)
                .max(100),

            initialMessage: z
                .string()
                .trim()
                .max(5000)
                .nullable(),
        })
        .superRefine(
            (
                value,
                context,
            ) => {
                if (
                    value.type ===
                    "DIRECT" &&
                    value.members.length !==
                    1
                ) {
                    context.addIssue({
                        code:
                        z.ZodIssueCode.custom,

                        path: [
                            "members",
                        ],

                        message:
                            "Private conversation must contain exactly one recipient.",
                    });
                }

                if (
                    value.type !==
                    "DIRECT" &&
                    !value.title
                ) {
                    context.addIssue({
                        code:
                        z.ZodIssueCode.custom,

                        path: [
                            "title",
                        ],

                        message:
                            "Conversation title is required.",
                    });
                }
            },
        );