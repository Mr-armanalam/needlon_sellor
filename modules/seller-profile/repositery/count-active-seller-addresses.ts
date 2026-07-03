import { and, count, eq, isNull } from "drizzle-orm";
import {sellerAddresses} from "@/db/schema/seller/seller-address";
import {DbTransaction} from "@/db/transactions";
import {getDatabase} from "@/db/database";
interface Params {
    tx?: DbTransaction;
    sellerId: string;
}
export async function countActiveSellerAddresses({sellerId,tx}: Params) {
    const database = getDatabase(tx);
    const [result] = await database
        .select({
            count: count(),
        })
        .from(sellerAddresses)
        .where(
            and(
                eq(sellerAddresses.sellerId, sellerId),
                isNull(sellerAddresses.deletedAt),
            ),
        );

    return result.count;
}