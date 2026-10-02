// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/dto/shared-product.dto.ts
// Description:
// DTO representing a product shared inside a conversation.
// ============================================================================

/**
 * ============================================================================
 * Shared Product Seller DTO
 * ============================================================================
 */

export interface SharedProductSellerDto {
    /**
     * Seller identifier.
     */
    id: string;

    /**
     * Seller display name.
     */
    name: string;

    /**
     * Store name.
     */
    storeName: string;

    /**
     * Store logo.
     */
    storeLogoUrl: string | null;
}

/**
 * ============================================================================
 * Shared Product Variant DTO
 * ============================================================================
 */

export interface SharedProductVariantDto {
    /**
     * Variant identifier.
     */
    id: string;

    /**
     * Variant name.
     */
    name: string;

    /**
     * SKU.
     */
    sku: string | null;

    /**
     * Selling price.
     */
    sellingPrice: number;

    /**
     * Original price.
     */
    originalPrice: number | null;

    /**
     * Currency.
     */
    currency: string;

    /**
     * Available inventory.
     */
    availableQuantity: number;

    /**
     * Primary variant image.
     */
    imageUrl: string | null;
}

/**
 * ============================================================================
 * Shared Product DTO
 * ============================================================================
 */

export interface SharedProductDto {
    /**
     * Shared record identifier.
     */
    id: string;

    /**
     * Parent message identifier.
     */
    messageId: string;

    /**
     * Product identifier.
     */
    productId: string;

    /**
     * Product slug.
     */
    slug: string;

    /**
     * Product title.
     */
    title: string;

    /**
     * Short description.
     */
    shortDescription: string | null;

    /**
     * Product thumbnail.
     */
    thumbnailUrl: string | null;

    /**
     * Product seller.
     */
    seller: SharedProductSellerDto;

    /**
     * Shared variant.
     */
    variant: SharedProductVariantDto | null;

    /**
     * Product availability.
     */
    isAvailable: boolean;

    /**
     * Whether the product
     * is currently active.
     */
    isActive: boolean;

    /**
     * Product detail page.
     */
    productUrl: string;

    /**
     * Shared timestamp.
     */
    createdAt: string;
}