// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/dto/conversation.dto.ts
// Description:
// DTO representing a conversation returned by the Messages API.
// ============================================================================

import {
    ConversationMemberRole,
    ConversationStatus,
    ConversationType,
} from "@/db/schema/messages";

/**
 * ============================================================================
 * Conversation Last Message DTO
 * ============================================================================
 */

export interface ConversationLastMessageDto {
    id: string;

    senderId: string;

    senderName: string | null;

    body: string | null;

    messageType: string;

    createdAt: string;

    isDeleted: boolean;
}

/**
 * ============================================================================
 * Conversation Member DTO
 * ============================================================================
 */

export interface ConversationMemberDto {
    sellerId: string;

    displayName: string;

    avatarUrl: string | null;

    role: ConversationMemberRole;

    isOnline: boolean;

    lastSeenAt: string | null;
}

/**
 * ============================================================================
 * Conversation DTO
 * ============================================================================
 */

export interface ConversationDto {
    /**
     * Conversation identity.
     */
    id: string;

    /**
     * PRIVATE | GROUP | SUPPORT
     */
    type: ConversationType;

    /**
     * ACTIVE | ARCHIVED | BLOCKED
     */
    status: ConversationStatus;

    /**
     * Conversation title.
     *
     * Null for private conversations.
     */
    title: string | null;

    /**
     * Conversation image.
     */
    avatarUrl: string | null;

    /**
     * Conversation description.
     */
    description: string | null;

    /**
     * Current authenticated seller.
     */
    currentSellerId: string;

    /**
     * Number of members.
     */
    memberCount: number;

    /**
     * Unread messages.
     */
    unreadCount: number;

    /**
     * Whether pinned by current seller.
     */
    isPinned: boolean;

    /**
     * Whether muted by current seller.
     */
    isMuted: boolean;

    /**
     * Whether archived by current seller.
     */
    isArchived: boolean;

    /**
     * Whether this conversation is currently active.
     */
    isActive: boolean;

    /**
     * Last message.
     */
    lastMessage:
        ConversationLastMessageDto | null;

    /**
     * Conversation members.
     */
    members: ConversationMemberDto[];

    /**
     * Created timestamp.
     */
    createdAt: string;

    /**
     * Updated timestamp.
     */
    updatedAt: string;
}