import { db } from "@/db";
import {AddressNotFoundError} from "@/modules/seller-profile/errors/address-not-found-error";
import {UpdateSellerAddressDto} from "@/modules/seller-profile/dto/seller-address.dto";
import {DefaultAddressRequiredError} from "@/modules/seller-profile/errors/default-address-required-error";
import {unsetDefaultAddress} from "@/modules/seller-profile/repositery/unset-default-address";
import {findSellerAddressById, updateSellerAddressById} from "@/modules/seller-profile/repositery";

interface UpdateSellerAddressServiceInput {
    sellerId: string;
    id: string;
    data: UpdateSellerAddressDto["data"];
}

export async function updateSellerAddressService(
    input: UpdateSellerAddressServiceInput,
) {
    return db.transaction(async (tx) => {
        const existing = await findSellerAddressById({
            tx,
            sellerId: input.sellerId,
            addressId: input.id,
        });

        if (!existing) {
            throw new AddressNotFoundError();
        }

        if (
            existing.isDefault &&
            input.data.isDefault === false
        ) {
            throw new DefaultAddressRequiredError();
        }

        if (
            input.data.isDefault === true &&
            !existing.isDefault
        ) {
            await unsetDefaultAddress({
                tx,
                sellerId: input.sellerId,
            });
        }

        return updateSellerAddressById({
            tx,
            sellerId: input.sellerId,
            id: input.id,
            data: input.data,
        });
    });
}