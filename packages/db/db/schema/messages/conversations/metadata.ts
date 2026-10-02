// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/conversations/metadata.ts
// Description:
// JSON metadata stored alongside a conversation.
//
// Metadata is intentionally flexible and contains non-relational,
// conversation-level information that does not justify dedicated columns.
// ============================================================================

/**
 * ============================================================================
 * Conversation Metadata
 * ============================================================================
 */
export interface ConversationMetadata {
    /**
     * Whether AI assistance has been enabled for
     * this conversation.
     */
    aiEnabled?: boolean;

    /**
     * Whether automated replies are enabled.
     */
    autoReplyEnabled?: boolean;

    /**
     * Optional conversation labels.
     *
     * Example:
     * ["VIP", "Wholesale", "High Priority"]
     */
    labels?: string[];

    /**
     * Seller-defined color/category.
     *
     * Example:
     * "green"
     * "orange"
     * "red"
     */
    category?: string | null;

    /**
     * Optional custom emoji shown in UI.
     */
    emoji?: string | null;

    /**
     * Indicates whether the conversation
     * has been starred.
     */
    starred?: boolean;

    /**
     * Seller notes that are never visible
     * to buyers.
     */
    internalNote?: string | null;
}