// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/messages/metadata.ts
// Description:
// JSON metadata stored alongside a message.
//
// This metadata stores optional information that is message-specific but
// doesn't warrant dedicated relational columns.
// ============================================================================

/**
 * ============================================================================
 * Message Metadata
 * ============================================================================
 */
export interface MessageMetadata {
    /**
     * Whether the message was generated
     * by an AI assistant.
     */
    aiGenerated?: boolean;

    /**
     * AI model identifier.
     *
     * Example:
     * "gpt-5.5"
     */
    aiModel?: string | null;

    /**
     * Optional language code.
     *
     * Example:
     * "en"
     * "hi"
     * "bn"
     */
    language?: string | null;

    /**
     * Optional translation language.
     */
    translatedLanguage?: string | null;

    /**
     * Indicates whether the message
     * has been translated.
     */
    translated?: boolean;

    /**
     * Original message text before
     * translation.
     */
    originalText?: string | null;

    /**
     * Indicates whether the sender
     * has starred this message.
     */
    starred?: boolean;

    /**
     * Indicates whether this message
     * has been forwarded.
     */
    forwarded?: boolean;

    /**
     * Indicates whether this message
     * is a reply.
     */
    replied?: boolean;

    /**
     * Whether the message contains
     * sensitive content.
     */
    sensitive?: boolean;

    /**
     * Optional client-side identifier
     * used before the server assigns
     * a permanent message ID.
     */
    clientMessageId?: string | null;

    /**
     * Arbitrary message tags.
     *
     * Example:
     * ["Important", "Order", "Support"]
     */
    tags?: string[];
}