// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/conversation-members/metadata.ts
// Description:
// JSON metadata stored for an individual conversation member.
//
// This metadata contains participant-specific preferences and UI state
// that should not be promoted to dedicated database columns.
// ============================================================================

/**
 * ============================================================================
 * Conversation Member Metadata
 * ============================================================================
 */
export interface ConversationMemberMetadata {
    /**
     * Optional nickname assigned by the participant.
     */
    nickname?: string | null;

    /**
     * Custom color used by the participant
     * for conversation organization.
     */
    color?: string | null;

    /**
     * Custom emoji shown beside the participant.
     */
    emoji?: string | null;

    /**
     * Whether the conversation is starred
     * by this participant.
     */
    starred?: boolean;

    /**
     * Whether this participant has marked
     * the conversation as important.
     */
    important?: boolean;

    /**
     * Whether desktop notifications
     * are enabled.
     */
    desktopNotificationsEnabled?: boolean;

    /**
     * Whether email notifications
     * are enabled.
     */
    emailNotificationsEnabled?: boolean;

    /**
     * Whether mobile push notifications
     * are enabled.
     */
    pushNotificationsEnabled?: boolean;

    /**
     * User-defined labels.
     *
     * Example:
     * ["VIP", "Wholesale", "Priority"]
     */
    labels?: string[];

    /**
     * Internal notes visible only
     * to this participant.
     */
    note?: string | null;
}