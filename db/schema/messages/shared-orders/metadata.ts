// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/shared-orders/metadata.ts
// Description:
// JSON metadata stored for a shared order snapshot.
//
// Shared orders preserve immutable order information at the time the
// message was sent so chat history remains accurate even if the actual
// order changes later.
// ============================================================================

/**
 * ============================================================================
 * Shared Order Metadata
 * ============================================================================
 */

export interface SharedOrderMetadata {
    /**
     * Buyer identifier.
     */
    buyerId?: string | null;

    /**
     * Buyer display name.
     */
    buyerName?: string | null;

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
     * Total number of products
     * included in the order.
     */
    totalItems?: number | null;

    /**
     * Snapshot of ordered products.
     */
    items?: Array<{
        productId?: string | null;

        variantId?: string | null;

        productName: string;

        variantName?: string | null;

        sku?: string | null;

        thumbnailUrl?: string | null;

        quantity: number;

        unitPrice: number;

        totalPrice: number;
    }>;

    /**
     * Subtotal before taxes,
     * discounts and shipping.
     */
    subtotal?: number | null;

    /**
     * Total discount.
     */
    discountAmount?: number | null;

    /**
     * Shipping charge.
     */
    shippingAmount?: number | null;

    /**
     * Tax amount.
     */
    taxAmount?: number | null;

    /**
     * Final payable amount.
     */
    grandTotal?: number | null;

    /**
     * Currency code.
     *
     * Example:
     * INR
     */
    currency?: string;

    /**
     * Payment method.
     *
     * Example:
     * COD
     * UPI
     * CARD
     */
    paymentMethod?: string | null;

    /**
     * Tracking number.
     */
    trackingNumber?: string | null;

    /**
     * Courier partner.
     */
    courierName?: string | null;

    /**
     * Estimated delivery date.
     *
     * ISO-8601 format.
     */
    estimatedDeliveryAt?: string | null;

    /**
     * Actual delivery date.
     *
     * ISO-8601 format.
     */
    deliveredAt?: string | null;

    /**
     * Whether the snapshot
     * still matches the current
     * order information.
     */
    snapshotValid?: boolean;

    /**
     * Snapshot creation time.
     *
     * ISO-8601 format.
     */
    snapshotAt?: string;

    /**
     * Provider-specific metadata.
     */
    providerMetadata?: Record<
        string,
        unknown
    >;
}