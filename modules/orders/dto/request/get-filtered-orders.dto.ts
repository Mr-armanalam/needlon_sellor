export interface GetFilteredOrdersRequestDto {
    status?: string;
    search?: string;
    deliveryMode?: string;
    valueTier?: string;
    dateRange?: string;
}
