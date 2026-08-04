import {AuthSeller} from "@/types/auth";
import {NotFoundError} from "@/modules/shared/errors";
import {getProductById} from "@/modules/products/repository/queries/get-product-by-id";

export const getProductByIdService = async (productId: string, seller: AuthSeller) => {
    if (!productId) {
        throw new NotFoundError('Product not found.');
    }
    return await getProductById(productId, seller);
}