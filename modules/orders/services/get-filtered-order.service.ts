import {getFilteredOrder} from "@/modules/orders/repositories/get-filtered-order";

export const getFilteredOrderService = async (searchParams: URLSearchParams, sellerId: string) => {
    return await getFilteredOrder(searchParams, sellerId);
}