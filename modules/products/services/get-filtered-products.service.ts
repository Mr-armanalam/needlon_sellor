import {UnauthorizedError} from "@/modules/shared/errors";
import {getFilteredProducts} from "@/modules/products/repository/queries/get-filtered-products";

export const getFilteredProductsService = async (searchParams: URLSearchParams, sellerId: string) => {
    if (!sellerId) {
        throw new UnauthorizedError();
    }

    return await getFilteredProducts(searchParams, sellerId);
}