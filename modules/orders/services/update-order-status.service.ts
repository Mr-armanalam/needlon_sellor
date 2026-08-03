import {updateOrderStatus} from "@/modules/orders/repositories/update-order-status";
import {BadRequestError} from "@/modules/shared/errors/bad-request-error";

export const updateOrderStatusService = async ({orderId, sellerId, action, remarks}: {orderId: string, sellerId: string, action: string, remarks: string}) => {
    if (!orderId) throw new BadRequestError();
    if (!action || !remarks) throw new BadRequestError();
    return await updateOrderStatus({orderId, sellerId, action, remarks});
}