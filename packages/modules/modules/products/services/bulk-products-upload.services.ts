import {AuthSeller} from "@/types/auth";
import {bulkProductUpload, type BulkProductUploadItem} from "@/modules/products/repository";

export const bulkProductsUploadServices = async (seller:AuthSeller, items:BulkProductUploadItem[])=> {
    return await bulkProductUpload(seller, items);
}