/**
 * ============================================================
 * Inventory Metadata
 * ============================================================
 *
 * Typed JSON stored inside
 * inventory.metadata.
 *
 * ============================================================
 */

export interface InventoryImportMetadata {
    /**
     * Import source.
     */
    source?: string;

    /**
     * Import timestamp (ISO-8601).
     */
    importedAt?: string;
}

export interface InventorySyncMetadata {
    /**
     * External ERP/WMS identifier.
     */
    externalId?: string;

    /**
     * Integration provider.
     */
    provider?: string;

    /**
     * Last synchronization timestamp.
     */
    syncedAt?: string;
}

export interface InventoryAiMetadata {
    /**
     * AI confidence score.
     */
    confidenceScore?: number;

    /**
     * AI-generated notes.
     */
    notes?: string;
}

export interface InventoryMetadata {
    /**
     * Import information.
     */
    import?: InventoryImportMetadata;

    /**
     * ERP/WMS synchronization metadata.
     */
    sync?: InventorySyncMetadata;

    /**
     * AI-generated metadata.
     */
    ai?: InventoryAiMetadata;

    /**
     * Future extensibility.
     */
    custom?: Record<string, unknown>;
}