import {AuthSeller} from "@/types/auth";
import {bulkProductUpload} from "@/modules/products/repository/commands/bulk-product-upload";

export const bulkProductsUploadServices = async (seller:AuthSeller, items:any)=> {
    return await bulkProductUpload(seller, items);
}