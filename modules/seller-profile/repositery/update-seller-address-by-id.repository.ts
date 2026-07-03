import { and, eq, isNull } from "drizzle-orm";

import {sellerAddresses} from "@/db/schema/seller/seller-address";
import {toSellerAddressForm} from "@/modules/seller-profile/mapper/seller-address-mapper";
import {DbTransaction} from "@/db/transactions";
import {getDatabase} from "@/db/database";

import { SellerAddressForm } from "../types/seller-address-form";

interface UpdateSellerAddressParams {
    sellerId: string;
    id: string;
    tx?: DbTransaction;

    data: Partial<
        Omit<
            SellerAddressForm,
            "id" | "isVerified"
        >
    >;
}
export async function updateSellerAddressById({
                                              sellerId,
                                              id,
                                              data,
                                              tx
                                          }: UpdateSellerAddressParams) {
    const database = getDatabase(tx);

    const [address] = await database
        .update(sellerAddresses)
        .set({
            ...data,
            updatedAt: new Date(),

            latitude:
                data.latitude == null
                    ? null
                    : String(data.latitude),

            longitude:
                data.longitude == null
                    ? null
                    : String(data.longitude),
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