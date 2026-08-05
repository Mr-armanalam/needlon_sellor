import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services";
import { updateOrderStatus } from "../repositery/update-order-status.repository";
import { BadRequestError } from "@/modules/shared/errors/bad-request-error";
import { UpdateOrderStatusRequestDto } from "../dto";

export const updateOrderStatusService = async (
    dto: UpdateOrderStatusRequestDto
): Promise<{ orderId: string; fromStatus: string; toStatus: string }> => {
    const { orderId, action, remarks } = dto;
    if (!orderId) throw new BadRequestError("Order ID is required.");
    if (!action) throw new BadRequestError("Action is required.");
    
    const seller = await getCurrentSellerOrThrow();
    
    const result = await updateOrderStatus({ orderId, sellerId: seller.id, action, remarks });
    return {
        orderId,
        fromStatus: result.fromStatus,
        toStatus: result.toStatus,
    };
};
