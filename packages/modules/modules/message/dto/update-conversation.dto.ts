// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/dto/update-conversation.dto.ts
// Description:
// Request DTO for updating an existing conversation.
// ============================================================================

/**
 * ============================================================================
 * Update Conversation DTO
 * ============================================================================
 */

export interface UpdateConversationDto {
    /**
     * Conversation title.
     *
     * Used for group conversations.
     */
    title?: string;

    /**
     * Conversation description.
     */
    description?: string | null;

    /**
     * Conversation avatar.
     */
    avatarUrl?: string | null;

    /**
     * Pin conversation for
     * the authenticated seller.
     */
    isPinned?: boolean;

    /**
     * Mute conversation for
     * the authenticated seller.
     */
    isMuted?: boolean;

    /**
     * Archive conversation for
     * the authenticated seller.
     */
    isArchived?: boolean;
}