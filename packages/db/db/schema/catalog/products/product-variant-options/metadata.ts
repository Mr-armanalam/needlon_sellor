/**
 * ============================================================
 * Product Variant Option Metadata
 * ============================================================
 *
 * Typed JSON stored inside
 * product_variant_options.metadata.
 *
 * ============================================================
 */

export interface ProductVariantOptionImportMetadata {
    source?: string;

    importedAt?: string;
}

export interface ProductVariantOptionAiMetadata {
    confidenceScore?: number;

    notes?: string;
}

export interface ProductVariantOptionMetadata {
    /**
     * Import information.
     */
    import?: ProductVariantOptionImportMetadata;

    /**
     * AI-generated metadata.
     */
    ai?: ProductVariantOptionAiMetadata;

    /**
     * Future extensibility.
     */
    custom?: Record<string, unknown>;
}