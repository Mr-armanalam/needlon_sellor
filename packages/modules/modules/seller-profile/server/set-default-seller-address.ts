import { db } from "@/db";

import { AddressNotFoundError } from "@/modules/seller-profile/errors/address-not-found-error";

import {
    findSellerAddressById,
    unsetDefaultAddress,
    updateSellerAddressById,
} from "@/modules/seller-profile/repositery";

interface SetDefaultSellerAddressServiceInput {
    sellerId: string;
    addressId: string;
}

export async function setDefaultSellerAddressService({
                                                         sellerId,
                                                         addressId,
                                                     }: SetDefaultSellerAddressServiceInput) {
    return db.transaction(async (tx) => {
        const address = await findSellerAddressById({
            tx,
            sellerId,
            addressId,
        });

        if (!address) {
            throw new AddressNotFoundError();
        }

        if (address.isDefault) {
            return address;
        }

        await unsetDefaultAddress({
            tx,
            sellerId,
        });

        return updateSellerAddressById({
            tx,
            sellerId,
            id: addressId,
            data: {
                isDefault: true,
            },
        });
    });
}