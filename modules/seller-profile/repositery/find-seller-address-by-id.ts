import { and, eq, isNull } from "drizzle-orm";
import {toSellerAddressForm} from "@/modules/seller-profile/mapper/seller-address-mapper";
import {sellerAddresses} from "@/db/schema/seller/seller-address";
import {DbTransaction} from "@/db/transactions";
import {getDatabase} from "@/db/database";

interface Props {
    tx?: DbTransaction;

    sellerId: string;
    addressId: string;
}

export async function findSellerAddressById({
                                                sellerId,
                                                addressId,
                                                tx
                                            }: Props) {
    const database = getDatabase(tx);
    const address = await database.query.sellerAddresses.findFirst({
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