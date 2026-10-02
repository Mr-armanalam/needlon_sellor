/**
 * ============================================================
 * Product Tag Metadata
 * ============================================================
 */

export interface ProductTagAiMetadata {
    /**
     * AI confidence score.
     */
    confidence?: number;

    /**
     * AI generated source.
     */
    generatedBy?: string;

    /**
     * Generated timestamp.
     */
    generatedAt?: string;
}

export interface ProductTagAnalyticsMetadata {
    /**
     * Number of products
     * using this tag.
     */
    usageCount?: number;

    /**
     * Search frequency.
     */
    searchCount?: number;

    /**
     * Click-through rate.
     */
    clickRate?: number;
}

export interface ProductTagImportMetadata {
    /**
     * Import source.
     */
    source?: string;

    /**
     * External identifier.
     */
    externalId?: string;
}

export interface ProductTagMetadata {
    /**
     * AI metadata.
     */
    ai?: ProductTagAiMetadata;

    /**
     * Analytics.
     */
    analytics?: ProductTagAnalyticsMetadata;

    /**
     * Import metadata.
     */
    import?: ProductTagImportMetadata;

    /**
     * Future extensions.
     */
    custom?: Record<string, unknown>;
}