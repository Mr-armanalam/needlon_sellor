import { getOrderById } from "@/modules/orders/repositories/get-order-by-id";
import { NotFoundError } from "@/modules/shared/errors";
import { GetOrderByIdRequestDto } from "../dto";
import { OrderMapper } from "../mapper/order.mapper";
import { OrderDomain } from "../types";

export const getOrderByIdService = async (
    dto: GetOrderByIdRequestDto, 
    sellerId: string
): Promise<OrderDomain> => {
    const { orderId } = dto;
    if (!orderId) {
        throw new NotFoundError("Order not found");
    }
    
    const dbResult = await getOrderById(orderId, sellerId);
    
    return OrderMapper.toOrderDomain(
        dbResult.order,
        dbResult.items,
        dbResult.addresses,
        dbResult.history,
        dbResult.payments
    );
};