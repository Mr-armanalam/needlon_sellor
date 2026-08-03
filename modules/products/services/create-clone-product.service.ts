import {AuthSeller} from "@/types/auth";
import {createCloneProduct} from "@/modules/products/repository/commands/create-clone-product";

export const createCloneProductService = async ({productId, seller}:{productId:string; seller: AuthSeller}) => {
    if (!productId) {
        throw new Error("Product not found");
    }
    return await createCloneProduct({productId, seller});
}