import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import {toSellerAddressForm} from "@/modules/seller-profile/mapper/seller-address-mapper";
import {sellerAddresses} from "@/db/schema/seller/seller-address";

interface Props {
    sellerId: string;
    addressId: string;
}

export async function findSellerAddress({
                                            sellerId,
                                            addressId,
                                        }: Props) {
    const address = await db.query.sellerAddresses.findFirst({
        where: and(
            eq(sellerAddresses.id, addressId),
            eq(sellerAddresses.sellerId, sellerId),
            isNull(sellerAddresses.deletedAt),
        ),
    });

    if (!address) {
        return null;
    }

    return toSellerAddressForm(address);
}