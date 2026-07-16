import {findSellerAddresses} from "@/modules/seller-profile/repositery";

export async function getSellerAddressesService(
    sellerId: string,
) {
    return findSellerAddresses(sellerId);
}

