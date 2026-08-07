// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/validation/send-message.schema.ts
// Description:
// Zod validation schema for sending a new message.
// ============================================================================

import { z } from "zod";

import {
    MESSAGE_TYPES,
} from "@/db/schema/messages";

/**
 * ============================================================================
 * Attachment Schema
 * ============================================================================
 */

const sendMessageAttachmentSchema =
    z.object({
        attachmentId: z
            .string()
            .uuid(),

        sortOrder: z
            .number()
            .int()
            .min(0),
    });

/**
 * ============================================================================
 * Shared Product Schema
 * ============================================================================
 */

const sharedProductSchema =
    z.object({
        productId: z
            .string()
            .uuid(),

        variantId: z
            .string()
            .uuid()
            .nullable(),
    });

/**
 * ============================================================================
 * Shared Order Schema
 * ============================================================================
 */

const sharedOrderSchema =
    z.object({
        orderId: z
            .string()
            .uuid(),
    });

/**
 * ============================================================================
 * Send Message Schema
 * ============================================================================
 */

export const sendMessageSchema =
    z
        .object({
            conversationId: z
                .string()
                .uuid(),

            messageType: z.enum(
                MESSAGE_TYPES,
            ),

            body: z
                .string()
                .trim()
                .max(5000)
                .nullable(),

            replyToMessageId: z
                .string()
                .uuid()
                .nullable(),

            attachments: z
                .array(
                    sendMessageAttachmentSchema,
                )
                .max(20),

            sharedProduct:
                sharedProductSchema
                    .nullable(),

            sharedOrder:
                sharedOrderSchema
                    .nullable(),
        })
        .superRefine(
            (
                value,
                context,
            ) => {
                const hasBody =
                    !!value.body &&
                    value.body.length > 0;

                const hasAttachments =
                    value.attachments.length >
                    0;

                const hasSharedProduct =
                    value.sharedProduct !==
                    null;

                const hasSharedOrder =
                    value.sharedOrder !==
                    null;

                if (
                    !hasBody &&
                    !hasAttachments &&
                    !hasSharedProduct &&
                    !hasSharedOrder
                ) {
                    context.addIssue({
                        code:
                        z.ZodIssueCode.custom,

                        path: [
                            "body",
                        ],

                        message:
                            "Message must contain text, attachment, shared product, or shared order.",
                    });
                }
            },
        );