/**
 * ============================================================
 * Product Metadata
 * ============================================================
 *
 * Typed JSON stored inside products.metadata.
 *
 * Product-specific metadata that doesn't justify
 * dedicated database columns belongs here.
 *
 * ============================================================
 */

export interface ProductSeoMetadata {
    metaTitle?: string;

    metaDescription?: string;

    keywords?: string[];

    canonicalUrl?: string;
}

export interface ProductAiMetadata {
    generated?: boolean;

    generatedBy?: string;

    prompt?: string;

    confidenceScore?: number;
}

export interface ProductBadgeMetadata {
    isNew?: boolean;

    isTrending?: boolean;

    isBestSeller?: boolean;

    isFeatured?: boolean;
}

export interface ProductCustomMetadata {
    [key: string]: unknown;
}

export interface ProductMetadata {
    seo?: ProductSeoMetadata;

    ai?: ProductAiMetadata;

    badges?: ProductBadgeMetadata;

    custom?: ProductCustomMetadata;
}