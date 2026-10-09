import { MOCK_ORDERS } from "@/lib/mock-data-provider";

export const OrderService = {
  async getRawUserOrders(userId: string, search: string) {
    return MOCK_ORDERS;
  }
};