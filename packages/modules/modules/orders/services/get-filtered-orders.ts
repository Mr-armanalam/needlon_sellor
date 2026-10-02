import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services";
import { findFilteredOrders } from "../repositery/find-filtered-orders.repository";
import { GetFilteredOrdersRequestDto } from "../dto";
import { toOrderDomain } from "../mapper/order-domain-mapper";
import { OrderDomain } from "../types";

export const getFilteredOrdersService = async (
    dto: GetFilteredOrdersRequestDto
): Promise<{ items: OrderDomain[]; counts: Record<string, number> }> => {
    const seller = await getCurrentSellerOrThrow();
    
    const { items, counts } = await findFilteredOrders({ dto, sellerId: seller.id });
    
    const domainItems = items.map(item => {
        const { items: orderItemRows, ...orderRow } = item;
        return toOrderDomain(orderRow, orderItemRows);
    });

    return {
        items: domainItems,
        counts,
    };
};
