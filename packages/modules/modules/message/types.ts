// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/types.ts
// Description:
// Shared module types used across the Messages feature.
// ============================================================================

import {
    ConversationMemberRole,
    ConversationMemberStatus,
    ConversationType,
    MessageAttachmentType,
    MessageNotificationPriority,
    MessageNotificationStatus,
    MessageNotificationType,
    MessageReaction,
    MessageStatus,
    MessageType,
} from "@/db/schema/messages";

/**
 * ============================================================================
 * Conversations
 * ============================================================================
 */

export type ConversationId = string;

export type MessageId = string;

export type AttachmentId = string;

export type NotificationId = string;

/**
 * ============================================================================
 * Conversation
 * ============================================================================
 */

export interface ConversationSummary {
    id: ConversationId;

    type: ConversationType;

    title: string | null;

    avatarUrl: string | null;

    lastMessageId: MessageId | null;

    unreadCount: number;

    memberCount: number;

    isMuted: boolean;

    isPinned: boolean;

    isArchived: boolean;

    updatedAt: string;
}

/**
 * ============================================================================
 * Conversation Member
 * ============================================================================
 */

export interface ConversationMemberSummary {
    sellerId: string;

    role: ConversationMemberRole;

    status: ConversationMemberStatus;

    joinedAt: string;

    lastReadMessageId: string | null;
}

/**
 * ============================================================================
 * Message
 * ============================================================================
 */

export interface MessageSummary {
    id: MessageId;

    conversationId: ConversationId;

    senderId: string;

    type: MessageType;

    status: MessageStatus;

    body: string | null;

    replyToMessageId: string | null;

    attachmentCount: number;

    reactionCount: number;

    createdAt: string;
}

/**
 * ============================================================================
 * Attachment
 * ============================================================================
 */

export interface MessageAttachmentSummary {
    id: AttachmentId;

    messageId: MessageId;

    type: MessageAttachmentType;

    fileName: string;

    mimeType: string;

    size: number;

    url: string;
}

/**
 * ============================================================================
 * Reaction
 * ============================================================================
 */

export interface MessageReactionSummary {
    messageId: MessageId;

    sellerId: string;

    reaction: MessageReaction;

    reactedAt: string;
}

/**
 * ============================================================================
 * Notification
 * ============================================================================
 */

export interface MessageNotificationSummary {
    id: NotificationId;

    recipientSellerId: string;

    type: MessageNotificationType;

    status: MessageNotificationStatus;

    priority: MessageNotificationPriority;

    title: string;

    body: string;

    isRead: boolean;

    createdAt: string;
}

/**
 * ============================================================================
 * Cursor Pagination
 * ============================================================================
 */

export interface CursorPagination {
    cursor: string | null;

    limit: number;
}

/**
 * ============================================================================
 * Cursor Result
 * ============================================================================
 */

export interface CursorResult<T> {
    items: T[];

    nextCursor: string | null;

    hasMore: boolean;
}