import {AuthSeller} from "@/types/auth";
import {bulkProductUpload} from "@/modules/products/repository";

export const bulkProductsUploadServices = async (seller:AuthSeller, items:any)=> {
    return await bulkProductUpload(seller, items);
}