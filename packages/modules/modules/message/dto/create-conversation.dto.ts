// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/dto/create-conversation.dto.ts
// Description:
// Request DTO for creating a new conversation.
// ============================================================================

import {
    ConversationType,
} from "@/db/schema/messages";

/**
 * ============================================================================
 * Create Conversation Member DTO
 * ============================================================================
 */

export interface CreateConversationMemberDto {
    /**
     * Seller to include
     * in the conversation.
     */
    sellerId: string;

    /**
     * Whether this seller
     * starts as an admin.
     */
    isAdmin?: boolean;
}

/**
 * ============================================================================
 * Create Conversation DTO
 * ============================================================================
 */

export interface CreateConversationDto {
    /**
     * Conversation type.
     *
     * PRIVATE | GROUP | SUPPORT
     */
    type: ConversationType;

    /**
     * Group title.
     *
     * Null for private conversations.
     */
    title: string | null;

    /**
     * Optional group description.
     */
    description: string | null;

    /**
     * Group avatar.
     */
    avatarUrl: string | null;

    /**
     * Initial members.
     *
     * The authenticated seller
     * will be added automatically.
     */
    members: CreateConversationMemberDto[];

    /**
     * Optional first message.
     */
    initialMessage: string | null;
}