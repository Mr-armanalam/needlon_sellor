import { OrderRepository } from "../repositories/order-repository";

export const OrderService = {
  /**
   * Fetch buyer orders formatted for groupOrderItems transformer
   */
  async getRawUserOrders(userId: string, search: string = "") {
    return await OrderRepository.getRawUserOrders(userId, search);
  },

  /**
   * Fetch full order details including address, timeline and shipments
   */
  async getOrderDetail(orderId: string, userId?: string) {
    return await OrderRepository.getOrderDetail(orderId, userId);
  },

  /**
   * Atomic order cancellation for PENDING / CONFIRMED orders
   */
  async cancelOrder(orderId: string, userId: string, reason?: string) {
    return await OrderRepository.cancelOrder(orderId, userId, reason);
  },
};