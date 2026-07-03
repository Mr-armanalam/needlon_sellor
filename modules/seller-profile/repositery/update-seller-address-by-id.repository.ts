import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import {UpdateSellerAddressDto} from "@/modules/seller-profile/dto/seller-address.dto";
import {sellerAddresses} from "@/db/schema/seller/seller-address";
import {toSellerAddressForm} from "@/modules/seller-profile/mapper/seller-address-mapper";

interface UpdateSellerAddressParams extends UpdateSellerAddressDto {
    sellerId: string;
}

export async function updateSellerAddress({
                                              sellerId,
                                              id,
                                              data,
                                          }: UpdateSellerAddressParams) {
    const [address] = await db
        .update(sellerAddresses)
        .set({
            ...data,
            updatedAt: new Date(),

            latitude: data.latitude ? String(data.latitude) : null,
            longitude: data.longitude ? String(data.longitude) : null,
        })
        .where(
            and(
                eq(sellerAddresses.id, id),
                eq(sellerAddresses.sellerId, sellerId),
                isNull(sellerAddresses.deletedAt),
            ),
        )
        .returning();

    return address ? toSellerAddressForm(address) : null;
}