// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/dto/send-message.dto.ts
// Description:
// Request DTO for sending a new message.
// ============================================================================

import {
    MessageType,
} from "@/db/schema/messages";

/**
 * ============================================================================
 * Message Attachment Upload DTO
 * ============================================================================
 */

export interface SendMessageAttachmentDto {
    /**
     * Uploaded attachment identifier.
     */
    attachmentId: string;

    /**
     * Display order.
     */
    sortOrder: number;
}

/**
 * ============================================================================
 * Shared Product DTO
 * ============================================================================
 */

export interface SendSharedProductDto {
    /**
     * Product identifier.
     */
    productId: string;

    /**
     * Selected variant.
     */
    variantId: string | null;
}

/**
 * ============================================================================
 * Shared Order DTO
 * ============================================================================
 */

export interface SendSharedOrderDto {
    /**
     * Order identifier.
     */
    orderId: string;
}

/**
 * ============================================================================
 * Send Message DTO
 * ============================================================================
 */

export interface SendMessageDto {
    /**
     * Conversation identifier.
     */
    conversationId: string;

    /**
     * Message type.
     */
    messageType: MessageType;

    /**
     * Text message.
     */
    body: string | null;

    /**
     * Reply target.
     */
    replyToMessageId: string | null;

    /**
     * Uploaded attachments.
     */
    attachments: SendMessageAttachmentDto[];

    /**
     * Shared product.
     */
    sharedProduct: SendSharedProductDto | null;

    /**
     * Shared order.
     */
    sharedOrder: SendSharedOrderDto | null;
}