// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/dto/message-reaction.dto.ts
// Description:
// DTO representing a message reaction returned by the Messages API.
// ============================================================================

import {
    MessageReaction,
} from "@/db/schema/messages";

/**
 * ============================================================================
 * Message Reaction User DTO
 * ============================================================================
 */

export interface MessageReactionUserDto {
    /**
     * Seller identifier.
     */
    id: string;

    /**
     * Seller display name.
     */
    name: string;

    /**
     * Seller profile image.
     */
    avatarUrl: string | null;
}

/**
 * ============================================================================
 * Message Reaction DTO
 * ============================================================================
 */

export interface MessageReactionDto {
    /**
     * Reaction identifier.
     */
    id: string;

    /**
     * Message identifier.
     */
    messageId: string;

    /**
     * User who reacted.
     */
    seller: MessageReactionUserDto;

    /**
     * Reaction value.
     *
     * ❤️ 👍 😂 😍 etc.
     */
    reaction: MessageReaction;

    /**
     * Whether this reaction belongs
     * to the authenticated seller.
     */
    isOwnReaction: boolean;

    /**
     * Creation timestamp.
     */
    createdAt: string;
}