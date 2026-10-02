// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/keys.ts
// Description:
// TanStack Query keys for the Messages module.
// ============================================================================

/**
 * ============================================================================
 * Conversations
 * ============================================================================
 */

export const conversationKeys = {
    all: ["conversations"] as const,

    list: () =>
        [...conversationKeys.all, "list"] as const,

    infinite: () =>
        [...conversationKeys.all, "infinite"] as const,

    detail: (
        conversationId: string,
    ) =>
        [
            ...conversationKeys.all,
            "detail",
            conversationId,
        ] as const,

    members: (
        conversationId: string,
    ) =>
        [
            ...conversationKeys.all,
            "members",
            conversationId,
        ] as const,
};

/**
 * ============================================================================
 * Messages
 * ============================================================================
 */

export const messageKeys = {
    all: ["messages"] as const,

    list: (
        conversationId: string,
    ) =>
        [
            ...messageKeys.all,
            "list",
            conversationId,
        ] as const,

    infinite: (
        conversationId: string,
    ) =>
        [
            ...messageKeys.all,
            "infinite",
            conversationId,
        ] as const,

    detail: (
        messageId: string,
    ) =>
        [
            ...messageKeys.all,
            "detail",
            messageId,
        ] as const,

    replies: (
        messageId: string,
    ) =>
        [
            ...messageKeys.all,
            "replies",
            messageId,
        ] as const,

    search: (
        conversationId: string,
        query: string,
    ) =>
        [
            ...messageKeys.all,
            "search",
            conversationId,
            query,
        ] as const,
};

/**
 * ============================================================================
 * Attachments
 * ============================================================================
 */

export const messageAttachmentKeys = {
    all: ["message-attachments"] as const,

    list: (
        messageId: string,
    ) =>
        [
            ...messageAttachmentKeys.all,
            "list",
            messageId,
        ] as const,

    detail: (
        attachmentId: string,
    ) =>
        [
            ...messageAttachmentKeys.all,
            "detail",
            attachmentId,
        ] as const,
};

/**
 * ============================================================================
 * Reactions
 * ============================================================================
 */

export const messageReactionKeys = {
    all: ["message-reactions"] as const,

    list: (
        messageId: string,
    ) =>
        [
            ...messageReactionKeys.all,
            "list",
            messageId,
        ] as const,
};

/**
 * ============================================================================
 * Notifications
 * ============================================================================
 */

export const messageNotificationKeys = {
    all: ["message-notifications"] as const,

    list: () =>
        [
            ...messageNotificationKeys.all,
            "list",
        ] as const,

    unread: () =>
        [
            ...messageNotificationKeys.all,
            "unread",
        ] as const,

    detail: (
        notificationId: string,
    ) =>
        [
            ...messageNotificationKeys.all,
            "detail",
            notificationId,
        ] as const,
};

/**
 * ============================================================================
 * Shared Products
 * ============================================================================
 */

export const sharedProductKeys = {
    all: ["shared-products"] as const,

    detail: (
        messageId: string,
    ) =>
        [
            ...sharedProductKeys.all,
            messageId,
        ] as const,
};

/**
 * ============================================================================
 * Shared Orders
 * ============================================================================
 */

export const sharedOrderKeys = {
    all: ["shared-orders"] as const,

    detail: (
        messageId: string,
    ) =>
        [
            ...sharedOrderKeys.all,
            messageId,
        ] as const,
};

export const messagesKeys = {
    conversations: () => ["conversations", "list"] as const,
    conversation: (conversationId: string) => ["conversations", "detail", conversationId] as const,
    conversationSearch: (query: string) => ["conversations", "search", query] as const,
    messages: (conversationId: string) => ["messages", "list", conversationId] as const,
    message: (messageId: string) => ["messages", "detail", messageId] as const,
    notifications: () => ["message-notifications", "list"] as const,
};