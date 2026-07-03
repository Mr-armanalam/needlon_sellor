import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import {sellerAddresses} from "@/db/schema/seller/seller-address";

interface DeleteSellerAddressParams {
    sellerId: string;
    addressId: string;
}

export async function deleteSellerAddress({
                                              sellerId,
                                              addressId,
                                          }: DeleteSellerAddressParams) {
    const [address] = await db
        .update(sellerAddresses)
        .set({
            deletedAt: new Date(),
            isActive: false,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(sellerAddresses.id, addressId),
                eq(sellerAddresses.sellerId, sellerId),
                isNull(sellerAddresses.deletedAt),
            ),
        )
        .returning({
            id: sellerAddresses.id,
        });

    return address ?? null;
}