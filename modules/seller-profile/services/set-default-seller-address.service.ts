import { db } from "@/db";
import {findSellerAddressById, unsetDefaultAddress, updateSellerAddressById} from "@/modules/seller-profile/repositery";

export async function setDefaultSellerAddressService(
    sellerId: string,
    addressId: string,
) {
    return db.transaction(async (tx) => {
        await findSellerAddressById({
            sellerId,
            addressId,
            tx,
        });

        await unsetDefaultAddress({
            sellerId,
            tx,
        });

        return updateSellerAddressById({
            sellerId,
            id: addressId,
            data: {
                isDefault: true,
            },
            tx,
        });
    });
}