// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/notifications/metadata.ts
// Description:
// JSON metadata stored for a conversation notification.
//
// The notification payload is intentionally flexible so that new
// notification types can be introduced without requiring database
// schema changes.
// ============================================================================

/**
 * ============================================================================
 * Notification Action
 * ============================================================================
 */

export interface NotificationAction {
    /**
     * Action identifier.
     *
     * Example:
     * OPEN_CHAT
     */
    id: string;

    /**
     * Button label.
     */
    label: string;

    /**
     * Deep link or route.
     */
    url: string;

    /**
     * Whether authentication
     * is required.
     */
    requiresAuth?: boolean;

    /**
     * Whether opening the action
     * automatically marks the
     * notification as read.
     */
    markAsRead?: boolean;
}

/**
 * ============================================================================
 * Notification Metadata
 * ============================================================================
 */

export interface NotificationMetadata {
    /**
     * Conversation identifier.
     */
    conversationId?: string | null;

    /**
     * Message identifier.
     */
    messageId?: string | null;

    /**
     * Sender identifier.
     */
    senderId?: string | null;

    /**
     * Sender display name.
     */
    senderName?: string | null;

    /**
     * Sender avatar.
     */
    senderAvatarUrl?: string | null;

    /**
     * Recipient identifier.
     */
    recipientId?: string | null;

    /**
     * Optional title override.
     */
    title?: string | null;

    /**
     * Notification body.
     */
    body?: string | null;

    /**
     * Preview text.
     */
    preview?: string | null;

    /**
     * Notification image.
     */
    imageUrl?: string | null;

    /**
     * Notification icon.
     */
    icon?: string | null;

    /**
     * Badge count displayed
     * by the client.
     */
    badgeCount?: number | null;

    /**
     * Primary action.
     */
    primaryAction?: NotificationAction | null;

    /**
     * Secondary actions.
     */
    actions?: NotificationAction[];

    /**
     * Additional payload
     * consumed by clients.
     */
    payload?: Record<
        string,
        unknown
    >;

    /**
     * Snapshot creation time.
     *
     * ISO-8601 format.
     */
    snapshotAt?: string;

    /**
     * Indicates whether the
     * notification payload is
     * still synchronized with
     * the originating resource.
     */
    snapshotValid?: boolean;

    /**
     * Provider-specific metadata.
     */
    providerMetadata?: Record<
        string,
        unknown
    >;
}