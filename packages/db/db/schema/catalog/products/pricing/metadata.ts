/**
 * ============================================================
 * Pricing Metadata
 * ============================================================
 *
 * Typed JSON stored inside
 * pricing.metadata.
 *
 * ============================================================
 */

export interface PricingImportMetadata {
    /**
     * Import source.
     */
    source?: string;

    /**
     * Import timestamp (ISO-8601).
     */
    importedAt?: string;
}

export interface PricingCampaignMetadata {
    /**
     * Campaign identifier.
     */
    campaignId?: string;

    /**
     * Campaign name.
     */
    campaignName?: string;
}

export interface PricingAiMetadata {
    /**
     * AI confidence score.
     */
    confidenceScore?: number;

    /**
     * AI-generated pricing notes.
     */
    notes?: string;
}

export interface PricingMetadata {
    /**
     * Import information.
     */
    import?: PricingImportMetadata;

    /**
     * Pricing campaign information.
     */
    campaign?: PricingCampaignMetadata;

    /**
     * AI-generated metadata.
     */
    ai?: PricingAiMetadata;

    /**
     * Future extensibility.
     */
    custom?: Record<string, unknown>;
}