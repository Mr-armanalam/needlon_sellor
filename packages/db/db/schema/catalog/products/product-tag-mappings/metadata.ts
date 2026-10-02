/**
 * ============================================================
 * Product Tag Mapping Metadata
 * ============================================================
 */

export interface ProductTagMappingImportMetadata {
    /**
     * Import source.
     */
    source?: string;

    /**
     * External identifier.
     */
    externalId?: string;
}

export interface ProductTagMappingAiMetadata {
    /**
     * AI confidence score.
     */
    confidence?: number;

    /**
     * Assignment source.
     */
    assignedBy?: string;
}

export interface ProductTagMappingMetadata {
    /**
     * Import information.
     */
    import?: ProductTagMappingImportMetadata;

    /**
     * AI assignment metadata.
     */
    ai?: ProductTagMappingAiMetadata;

    /**
     * Future extensibility.
     */
    custom?: Record<string, unknown>;
}