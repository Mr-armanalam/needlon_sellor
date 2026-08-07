// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/message-reads/metadata.ts
// Description:
// JSON metadata stored for an individual message read receipt.
//
// This metadata captures device information, synchronization state,
// network information and analytics that don't require dedicated columns.
// ============================================================================

/**
 * ============================================================================
 * Message Read Metadata
 * ============================================================================
 */
export interface MessageReadMetadata {
    /**
     * Device identifier.
     */
    deviceId?: string | null;

    /**
     * Device name.
     *
     * Example:
     * "iPhone 15 Pro"
     * "Chrome on Windows"
     */
    deviceName?: string | null;

    /**
     * Operating system.
     *
     * Example:
     * "Windows"
     * "Android"
     * "iOS"
     */
    operatingSystem?: string | null;

    /**
     * Browser name.
     *
     * Example:
     * Chrome
     * Safari
     * Firefox
     */
    browser?: string | null;

    /**
     * Browser version.
     */
    browserVersion?: string | null;

    /**
     * Session identifier.
     */
    sessionId?: string | null;

    /**
     * IP address from which
     * the read receipt originated.
     */
    ipAddress?: string | null;

    /**
     * User agent string.
     */
    userAgent?: string | null;

    /**
     * Read source.
     *
     * Example:
     * WEB
     * ANDROID
     * IOS
     */
    source?:
        | "WEB"
        | "ANDROID"
        | "IOS"
        | "DESKTOP"
        | "SYSTEM";

    /**
     * Synchronization status
     * across user devices.
     */
    syncStatus?:
        | "PENDING"
        | "SYNCED"
        | "FAILED";

    /**
     * Time when the read receipt
     * was synchronized.
     */
    syncedAt?: string | null;

    /**
     * Network latency (milliseconds).
     */
    latencyMs?: number | null;

    /**
     * Additional provider-specific
     * metadata.
     */
    providerMetadata?: Record<
        string,
        unknown
    >;
}