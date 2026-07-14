import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import {sellerBankAccounts} from "@/db/schema/seller/seller-bank-account";

interface UpdateBankAccountParams {
    sellerId: string;
    accountId: string;
}

export async function deleteUPI_ID({
                                            sellerId,
                                            accountId,
                                        }: UpdateBankAccountParams) {
    const [account] = await db
        .update(sellerBankAccounts)
        .set({
            upiId: null,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(sellerBankAccounts.id, accountId),
                eq(
                    sellerBankAccounts.sellerId,
                    sellerId,
                ),
                isNull(
                    sellerBankAccounts.deletedAt,
                ),
            ),
        )
        .returning();

    return account;
}