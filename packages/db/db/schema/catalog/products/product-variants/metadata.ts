/**
 * ============================================================
 * Product Variant Metadata
 * ============================================================
 *
 * Typed JSON stored inside
 * product_variants.metadata.
 *
 * ============================================================
 */

export interface ProductVariantDimensionsMetadata {
    length?: number;

    width?: number;

    height?: number;

    unit?: string;
}

export interface ProductVariantWeightMetadata {
    value?: number;

    unit?: string;
}

export interface ProductVariantAiMetadata {
    tags?: string[];

    generatedTitle?: string;

    confidenceScore?: number;
}

export interface ProductVariantMetadata {
    /**
     * Physical dimensions.
     */
    dimensions?: ProductVariantDimensionsMetadata;

    /**
     * Shipping weight.
     */
    weight?: ProductVariantWeightMetadata;

    /**
     * AI-generated metadata.
     */
    ai?: ProductVariantAiMetadata;

    /**
     * Future extensibility.
     */
    custom?: Record<string, unknown>;
}