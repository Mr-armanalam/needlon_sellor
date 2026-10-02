/**
 * ============================================================
 * Product SEO Metadata
 * ============================================================
 *
 * Typed JSON stored inside
 * product_seo.metadata.
 *
 * ============================================================
 */

export interface ProductSeoAiMetadata {
    /**
     * AI SEO score.
     */
    score?: number;

    /**
     * AI recommendations.
     */
    recommendations?: string[];

    /**
     * Last optimization timestamp.
     */
    optimizedAt?: string;
}

export interface ProductSeoImportMetadata {
    /**
     * Import source.
     */
    source?: string;

    /**
     * External identifier.
     */
    externalId?: string;
}

export interface ProductSeoAnalyticsMetadata {
    /**
     * Search impressions.
     */
    impressions?: number;

    /**
     * Search clicks.
     */
    clicks?: number;

    /**
     * Average search position.
     */
    averagePosition?: number;
}

export interface ProductSeoMetadata {
    /**
     * AI-generated metadata.
     */
    ai?: ProductSeoAiMetadata;

    /**
     * Import information.
     */
    import?: ProductSeoImportMetadata;

    /**
     * Search analytics.
     */
    analytics?: ProductSeoAnalyticsMetadata;

    /**
     * Future extensibility.
     */
    custom?: Record<string, unknown>;
}