import { and, eq, isNull } from "drizzle-orm";

import {sellerAddresses} from "@/db/schema/seller/seller-address";
import {DbTransaction} from "@/db/transactions";
import {getDatabase} from "@/db/database";

interface Params {
    tx?: DbTransaction;
    sellerId: string;
}

export async function findDefaultSellerAddress({
                                                   tx,
                                                   sellerId,
                                               }: Params) {
    const database = getDatabase(tx);

    return database.query.sellerAddresses.findFirst({
        where: and(
            eq(sellerAddresses.sellerId, sellerId),
            eq(sellerAddresses.isDefault, true),
            isNull(sellerAddresses.deletedAt),
        ),
    });
}