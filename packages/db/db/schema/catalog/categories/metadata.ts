/**
 * ============================================================
 * Category Metadata
 * ============================================================
 *
 * Typed JSON stored inside categories.metadata
 *
 * Keep this interface:
 *
 * - Serializable
 * - Stable
 * - UI independent
 * - Business oriented
 *
 * ============================================================
 */

export interface CategorySeoMetadata {
    title?: string;

    description?: string;

    keywords?: string[];

    canonicalUrl?: string;
}

export interface CategoryDisplayMetadata {
    icon?: string;

    accentColor?: string;

    badge?: string;
}

export interface CategoryMetadata {
    seo?: CategorySeoMetadata;

    display?: CategoryDisplayMetadata;

    /**
     * Reserved for future extensions.
     *
     * Example:
     * analytics
     * recommendation
     * personalization
     */
    custom?: Record<string, unknown>;
}

