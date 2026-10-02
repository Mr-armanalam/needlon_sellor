import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import {sellerBankAccounts} from "@/db/schema/seller/seller-bank-account";

interface FindBankAccountParams {
    sellerId: string;
    accountId: string;
}

export async function findBankAccount({
                                          sellerId,
                                          accountId,
                                      }: FindBankAccountParams) {
    return db.query.sellerBankAccounts.findFirst({
        where: and(
            eq(sellerBankAccounts.id, accountId),
            eq(sellerBankAccounts.sellerId, sellerId),
            isNull(sellerBankAccounts.deletedAt),
        ),
    });
}