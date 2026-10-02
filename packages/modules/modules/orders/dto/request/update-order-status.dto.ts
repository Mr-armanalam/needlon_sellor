export interface UpdateOrderStatusRequestDto {
    orderId: string;
    action: "ADVANCE" | "CANCEL" | string;
    remarks: string;
}
