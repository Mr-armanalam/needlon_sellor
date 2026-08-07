// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/shared-products/metadata.ts
// Description:
// JSON metadata stored for a shared product snapshot.
//
// A shared product should remain viewable even if the actual catalog
// product changes later. This metadata stores immutable snapshot data
// used for rendering chat history.
// ============================================================================

/**
 * ============================================================================
 * Shared Product Metadata
 * ============================================================================
 */

export interface SharedProductMetadata {
    /**
     * Product thumbnail
     * at the time of sharing.
     */
    thumbnailUrl?: string | null;

    /**
     * Additional gallery images.
     */
    imageUrls?: string[];

    /**
     * Brand name.
     */
    brandName?: string | null;

    /**
     * Category hierarchy.
     *
     * Example:
     * Men > Shirts > Casual
     */
    categoryPath?: string[];

    /**
     * Variant information.
     *
     * Example:
     * Color: Black
     * Size: XL
     */
    variantAttributes?: Record<
        string,
        string
    >;

    /**
     * Original price before discount.
     */
    originalPrice?: number | null;

    /**
     * Discount percentage.
     */
    discountPercentage?: number | null;

    /**
     * Currency.
     *
     * Example:
     * INR
     */
    currency?: string;

    /**
     * Seller identifier.
     */
    sellerId?: string | null;

    /**
     * Seller display name.
     */
    sellerName?: string | null;

    /**
     * Store identifier.
     */
    storeId?: string | null;

    /**
     * Store name.
     */
    storeName?: string | null;

    /**
     * Whether the product
     * was in stock when shared.
     */
    inStock?: boolean;

    /**
     * Remaining stock at the
     * moment of sharing.
     */
    availableQuantity?: number | null;

    /**
     * Average product rating.
     */
    averageRating?: number | null;

    /**
     * Total review count.
     */
    reviewCount?: number | null;

    /**
     * Whether this product
     * was featured.
     */
    featured?: boolean;

    /**
     * Indicates whether this
     * snapshot is still current.
     */
    snapshotValid?: boolean;

    /**
     * ISO timestamp indicating
     * when the snapshot
     * was captured.
     */
    snapshotAt?: string;

    /**
     * Additional provider-specific
     * metadata.
     */
    providerMetadata?: Record<
        string,
        unknown
    >;
}