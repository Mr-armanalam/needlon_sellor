import {getOrderById} from "@/modules/orders/repositories/get-order-by-id";
import {NotFoundError} from "@/modules/shared/errors";

export const getOrderByIdService = async (orderId: string, sellerId: string) => {
    if (!orderId) {
        throw new NotFoundError("Order not found");
    }
    return getOrderById(orderId, sellerId);
};