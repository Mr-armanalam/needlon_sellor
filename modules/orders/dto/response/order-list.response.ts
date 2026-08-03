export interface OrderListItemLineDto {
    id: string;
    orderId: string;
    productId: string;
    variantId: string | null;
    sku: string;
    productSlug: string;
    productName: string;
    variantName: string | null;
    thumbnailUrl: string | null;
    imageUrl: string | null;
    unitPrice: string;
    quantity: number;
    total: string;
}

export interface OrderListItemDto {
    id: string;
    sellerId: string;
    buyerId: string;
    storeId: string;
    shippingAddressId: string;
    billingAddressId: string | null;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    shippingMethod: string;
    priority: string;
    source: string;
    currency: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    subtotal: string;
    discountAmount: string;
    couponDiscount: string;
    shippingCharge: string;
    taxAmount: string;
    grandTotal: string;
    isGift: boolean;
    giftMessage: string | null;
    requiresSignature: boolean;
    sellerRemark: string | null;
    internalRemark: string | null;
    expectedDeliveryDate: string | null;
    actualDeliveryDate: string | null;
    acceptedAt: string | null;
    packedAt: string | null;
    readyAt: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
    cancelledAt: string | null;
    returnedAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    items: OrderListItemLineDto[];
}

export interface OrderListResponseDto {
    items: OrderListItemDto[];
    counts: Record<string, number>;
}
