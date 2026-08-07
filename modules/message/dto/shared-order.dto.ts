// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/dto/shared-order.dto.ts
// Description:
// DTO representing an order shared inside a conversation.
// ============================================================================

/**
 * ============================================================================
 * Shared Order Seller DTO
 * ============================================================================
 */

export interface SharedOrderSellerDto {
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
 * Shared Order Customer DTO
 * ============================================================================
 */

export interface SharedOrderCustomerDto {
    /**
     * Customer identifier.
     */
    id: string;

    /**
     * Customer name.
     */
    name: string;

    /**
     * Customer profile image.
     */
    avatarUrl: string | null;
}

/**
 * ============================================================================
 * Shared Order Item DTO
 * ============================================================================
 */

export interface SharedOrderItemDto {
    /**
     * Order item identifier.
     */
    id: string;

    /**
     * Product identifier.
     */
    productId: string;

    /**
     * Product name.
     */
    productName: string;

    /**
     * Variant name.
     */
    variantName: string | null;

    /**
     * Product image.
     */
    imageUrl: string | null;

    /**
     * Quantity ordered.
     */
    quantity: number;

    /**
     * Unit price.
     */
    unitPrice: number;

    /**
     * Total price.
     */
    totalPrice: number;
}

/**
 * ============================================================================
 * Shared Order DTO
 * ============================================================================
 */

export interface SharedOrderDto {
    /**
     * Shared record identifier.
     */
    id: string;

    /**
     * Parent message identifier.
     */
    messageId: string;

    /**
     * Order identifier.
     */
    orderId: string;

    /**
     * Human-readable order number.
     */
    orderNumber: string;

    /**
     * Order status.
     */
    orderStatus: string;

    /**
     * Payment status.
     */
    paymentStatus: string;

    /**
     * Fulfillment status.
     */
    fulfillmentStatus: string;

    /**
     * Seller information.
     */
    seller: SharedOrderSellerDto;

    /**
     * Customer information.
     */
    customer: SharedOrderCustomerDto;

    /**
     * Shared order items.
     */
    items: SharedOrderItemDto[];

    /**
     * Total item count.
     */
    totalItems: number;

    /**
     * Order grand total.
     */
    grandTotal: number;

    /**
     * Currency code.
     */
    currency: string;

    /**
     * Order details page.
     */
    orderUrl: string;

    /**
     * Whether the current seller
     * can access this order.
     */
    hasAccess: boolean;

    /**
     * Shared timestamp.
     */
    createdAt: string;
}