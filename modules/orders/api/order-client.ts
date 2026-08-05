import { apiClient } from "@/modules/shared/api";
import { OrderListItemDto, OrderDetailResponseDto } from "../dto";

export async function fetchOrdersClient(
  activeTab?: string,
  searchQuery?: string,
  filters?: {
    deliveryMode?: string;
    valueTier?: string;
    dateRange?: string;
  }
) {
  const params = new URLSearchParams();
  if (activeTab) {
    params.append("status", activeTab.toUpperCase().replaceAll(" ", "_"));
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  if (filters) {
    if (filters.deliveryMode) {
      params.append("deliveryMode", filters.deliveryMode);
    }
    if (filters.valueTier) {
      params.append("valueTier", filters.valueTier);
    }
    if (filters.dateRange) {
      params.append("dateRange", filters.dateRange);
    }
  }

  const data = await apiClient.get<{ items: OrderListItemDto[]; counts: Record<string, number> }>(
    `/api/seller/orders?${params.toString()}`
  );
  return { success: true, data };
}

export async function getOrderDetailsClient(orderId: string) {
  const data = await apiClient.get<OrderDetailResponseDto>(
    `/api/seller/orders/${orderId}`
  );
  return { success: true, data };
}

export async function updateOrderStatusClient(
  orderId: string,
  action: "ADVANCE" | "CANCEL",
  remarks?: string
) {
  const data = await apiClient.post<
    { orderId: string; fromStatus: string; toStatus: string },
    { action: "ADVANCE" | "CANCEL"; remarks?: string }
  >(`/api/seller/orders/${orderId}/action`, { action, remarks });
  return { success: true, data };
}
