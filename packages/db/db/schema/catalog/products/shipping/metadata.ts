/**
 * ============================================================
 * Shipping Metadata
 * ============================================================
 *
 * Typed JSON stored inside
 * shipping.metadata.
 *
 * ============================================================
 */

export interface ShippingPackagingMetadata {
    /**
     * Package type.
     *
     * Example:
     * Box
     * Envelope
     * Tube
     */
    packageType?: string;

    /**
     * Packaging notes.
     */
    notes?: string;
}

export interface ShippingCarrierMetadata {
    /**
     * Preferred shipping carrier.
     */
    preferredCarrier?: string;

    /**
     * Carrier service level.
     */
    serviceLevel?: string;
}

export interface ShippingAiMetadata {
    /**
     * AI confidence score.
     */
    confidenceScore?: number;

    /**
     * AI-generated shipping notes.
     */
    notes?: string;
}

export interface ShippingMetadata {
    /**
     * Packaging information.
     */
    packaging?: ShippingPackagingMetadata;

    /**
     * Carrier preferences.
     */
    carrier?: ShippingCarrierMetadata;

    /**
     * AI-generated metadata.
     */
    ai?: ShippingAiMetadata;

    /**
     * Future extensibility.
     */
    custom?: Record<string, unknown>;
}