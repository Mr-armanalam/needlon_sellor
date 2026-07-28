/**
 * ============================================================
 * Product Attribute Value Metadata
 * ============================================================
 *
 * Typed JSON stored inside
 * product_attribute_values.metadata.
 *
 * ============================================================
 */

export interface ProductAttributeValueImportMetadata {
    /**
     * Import source.
     */
    source?: string;

    /**
     * Import timestamp (ISO-8601).
     */
    importedAt?: string;
}

export interface ProductAttributeValueAiMetadata {
    /**
     * AI confidence score.
     */
    confidenceScore?: number;

    /**
     * AI notes.
     */
    notes?: string;
}

export interface ProductAttributeValueMetadata {
    /**
     * Import information.
     */
    import?: ProductAttributeValueImportMetadata;

    /**
     * AI-generated metadata.
     */
    ai?: ProductAttributeValueAiMetadata;

    /**
     * Future extensibility.
     */
    custom?: Record<string, unknown>;
}