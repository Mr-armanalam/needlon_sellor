export interface OrderItemDomain {
    id: string;
    orderId: string;
    sellerId: string;
    productId: string;
    variantId: string | null;
    sku: string;
    variantSku: string | null;
    productSlug: string;
    productName: string;
    variantName: string | null;
    brandName: string | null;
    categoryName: string | null;
    thumbnailUrl: string | null;
    imageUrl: string | null;
    snapshotSource: string;
    currency: string;
    unitPrice: number;
    compareAtPrice: number | null;
    discountType: string;
    discountAmount: number;
    taxType: string;
    taxRate: number;
    taxAmount: number;
    quantity: number;
    subtotal: number;
    total: number;
    weight: number | null;
    length: number | null;
    width: number | null;
    height: number | null;
    inventoryLocation: string | null;
    warehouseName: string | null;
    fulfillmentType: string;
    itemStatus: string;
    sellerSku: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface OrderAddressDomain {
    id: string;
    orderId: string;
    addressType: "DELIVERY" | "BILLING" | string;
    recipientName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string | null;
    landmark: string | null;
    city: string;
    district: string | null;
    state: string;
    postalCode: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    deliveryNotes: string | null;
    createdAt: Date;
}

export interface OrderStatusHistoryDomain {
    id: string;
    orderId: string;
    sellerId: string;
    changedByUserId: string | null;
    fromStatus: string | null;
    toStatus: string;
    action: string;
    source: string;
    result: string;
    reason: string | null;
    remarks: string | null;
    referenceId: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    changedAt: Date;
    createdAt: Date;
}

export interface OrderPaymentDomain {
    id: string;
    orderId: string;
    sellerId: string;
    paymentNumber: string;
    paymentStatus: string;
    paymentMethod: string;
    paymentGateway: string;
    currency: string;
    amount: number;
    gatewayFee: number | null;
    platformFee: number | null;
    taxAmount: number | null;
    netAmount: number;
    transactionId: string | null;
    gatewayPaymentId: string | null;
    gatewayOrderId: string | null;
    gatewayReferenceId: string | null;
    gatewaySignature: string | null;
    initiatedAt: Date | null;
    authorizedAt: Date | null;
    paidAt: Date | null;
    capturedAt: Date | null;
    failedAt: Date | null;
    cancelledAt: Date | null;
    expiredAt: Date | null;
    payerName: string | null;
    payerEmail: string | null;
    payerPhone: string | null;
    failureReason: string | null;
    gatewayResponse: unknown | null;
    notes: string | null;
    internalNotes: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface OrderDomain {
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
    subtotal: number;
    discountAmount: number;
    couponDiscount: number;
    shippingCharge: number;
    taxAmount: number;
    grandTotal: number;
    isGift: boolean;
    giftMessage: string | null;
    requiresSignature: boolean;
    sellerRemark: string | null;
    internalRemark: string | null;
    expectedDeliveryDate: Date | null;
    actualDeliveryDate: Date | null;
    acceptedAt: Date | null;
    packedAt: Date | null;
    readyAt: Date | null;
    shippedAt: Date | null;
    deliveredAt: Date | null;
    cancelledAt: Date | null;
    returnedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

    items?: OrderItemDomain[];
    addresses?: OrderAddressDomain[];
    history?: OrderStatusHistoryDomain[];
    payments?: OrderPaymentDomain[];
}

export type initial_tab = "INVOICE" | "PACKING_SLIP" | "SHIPPING_LABEL";
