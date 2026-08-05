import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services";
import { findOrderById } from "../repositery/find-order-by-id.repository";
import { GetOrderByIdRequestDto } from "../dto";
import { toOrderDomain } from "../mapper/order-domain-mapper";
import { OrderDomain } from "../types";
import { BadRequestError } from "@/modules/shared/errors";

export const getOrderByIdService = async (
    dto: GetOrderByIdRequestDto
): Promise<OrderDomain> => {
    const { orderId } = dto;
    if (!orderId) {
        throw new BadRequestError("Order ID is required.");
    }
    
    const seller = await getCurrentSellerOrThrow();
    
    const dbResult = await findOrderById({ orderId, sellerId: seller.id });
    
    return toOrderDomain(
        dbResult.order,
        dbResult.items,
        dbResult.addresses,
        dbResult.history,
        dbResult.payments
    );
};
