import { updateOrderStatus } from "@/modules/orders/repositories/update-order-status";
import { BadRequestError } from "@/modules/shared/errors/bad-request-error";
import { UpdateOrderStatusRequestDto } from "../dto";

export const updateOrderStatusService = async (
    dto: UpdateOrderStatusRequestDto, 
    sellerId: string
): Promise<{ orderId: string; fromStatus: string; toStatus: string }> => {
    const { orderId, action, remarks } = dto;
    if (!orderId) throw new BadRequestError();
    if (!action || !remarks) throw new BadRequestError();
    
    const result = await updateOrderStatus({ orderId, sellerId, action, remarks });
    return {
        orderId,
        fromStatus: result.fromStatus,
        toStatus: result.toStatus,
    };
};