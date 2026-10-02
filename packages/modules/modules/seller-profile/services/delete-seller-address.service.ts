import {deleteSellerAddress} from "@/modules/seller-profile/repositery";

export async function deleteSellerAddressService(
    sellerId: string,
    addressId: string,
) {
    await deleteSellerAddress({
        sellerId,
        addressId,
    });
}