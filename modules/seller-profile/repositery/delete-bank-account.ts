import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import {sellerBankAccounts} from "@/db/schema/seller/seller-bank-account";

interface DeleteBankAccountParams {
    sellerId: string;
    accountId: string;
}

export async function deleteBankAccount({
                                            sellerId,
                                            accountId,
                                        }: DeleteBankAccountParams) {
    const [account] = await db
        .update(sellerBankAccounts)
        .set({
            deletedAt: new Date(),
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