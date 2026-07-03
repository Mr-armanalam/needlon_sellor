import { and, eq, isNull } from "drizzle-orm";

import {sellerAddresses} from "@/db/schema/seller/seller-address";
import {DbTransaction} from "@/db/transactions";
import {getDatabase} from "@/db/database";

interface Params {
    tx?: DbTransaction;
    sellerId: string;
}

export async function unsetDefaultAddress({sellerId,tx}: Params) {
    const database = getDatabase(tx);

    await database
        .update(sellerAddresses)
        .set({
            isDefault: false,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(sellerAddresses.sellerId, sellerId),
                eq(sellerAddresses.isDefault, true),
                isNull(sellerAddresses.deletedAt),
            ),
        );
}