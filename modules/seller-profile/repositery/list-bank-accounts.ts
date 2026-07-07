import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import {sellerBankAccounts} from "@/db/schema/seller/seller-bank-account";

interface ListBankAccountsParams {
    sellerId: string;
}

export async function listBankAccounts({
                                           sellerId,
                                       }: ListBankAccountsParams) {
    return db.query.sellerBankAccounts.findMany({
        where: and(
            eq(sellerBankAccounts.sellerId, sellerId),
            isNull(sellerBankAccounts.deletedAt),
        ),

        orderBy: [
            asc(sellerBankAccounts.createdAt),
        ],
    });
}