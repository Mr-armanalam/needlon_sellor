import { getFilteredOrder } from "@/modules/orders/repositories/get-filtered-order";
import { GetFilteredOrdersRequestDto } from "../dto";
import { OrderMapper } from "../mapper/order.mapper";
import { OrderDomain } from "../types";

export const getFilteredOrderService = async (
    dto: GetFilteredOrdersRequestDto, 
    sellerId: string
): Promise<{ items: OrderDomain[]; counts: Record<string, number> }> => {
    const { items, counts } = await getFilteredOrder(dto, sellerId);
    
    // Map database entities to domain models
    const domainItems = items.map(item => {
        const { items: orderItemRows, ...orderRow } = item;
        return OrderMapper.toOrderDomain(orderRow, orderItemRows);
    });

    return {
        items: domainItems,
        counts,
    };
};