import { OrderListItemDto } from "./order-list.response";

export interface OrderDetailAddressDto {
    id: string;
    orderId: string;
    addressType: string;
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
    latitude: string | null;
    longitude: string | null;
    deliveryNotes: string | null;
    createdAt: string;
}

export interface OrderDetailHistoryDto {
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
    changedAt: string;
    createdAt: string;
}

export interface OrderDetailPaymentDto {
    id: string;
    orderId: string;
    sellerId: string;
    paymentNumber: string;
    paymentStatus: string;
    paymentMethod: string;
    paymentGateway: string;
    currency: string;
    amount: string;
    gatewayFee: string | null;
    platformFee: string | null;
    taxAmount: string | null;
    netAmount: string;
    transactionId: string | null;
    gatewayPaymentId: string | null;
    gatewayOrderId: string | null;
    gatewayReferenceId: string | null;
    gatewaySignature: string | null;
    initiatedAt: string | null;
    authorizedAt: string | null;
    paidAt: string | null;
    capturedAt: string | null;
    failedAt: string | null;
    cancelledAt: string | null;
    expiredAt: string | null;
    payerName: string | null;
    payerEmail: string | null;
    payerPhone: string | null;
    failureReason: string | null;
    gatewayResponse: unknown;
    notes: string | null;
    internalNotes: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface OrderDetailResponseDto extends OrderListItemDto {
    addresses: OrderDetailAddressDto[];
    history: OrderDetailHistoryDto[];
    payments: OrderDetailPaymentDto[];
}
