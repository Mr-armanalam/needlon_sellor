import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { sellerBankAccounts } from "@/db/schema/seller/seller-bank-account";

interface SetPrimaryBankAccountParams {
    sellerId: string;
    accountId: string;
}

export async function setPrimaryBankAccount({
                                                sellerId,
                                                accountId,
                                            }: SetPrimaryBankAccountParams) {
    return db.transaction(async (tx) => {
        await tx
            .update(sellerBankAccounts)
            .set({
                isPrimary: false,
                updatedAt: new Date(),
            })
            .where(
                eq(
                    sellerBankAccounts.sellerId,
                    sellerId,
                ),
            );

        const [account] = await tx
            .update(sellerBankAccounts)
            .set({
                isPrimary: true,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(
                        sellerBankAccounts.id,
                        accountId,
                    ),
                    eq(
                        sellerBankAccounts.sellerId,
                        sellerId,
                    ),
                ),
            )
            .returning();

        return account;
    });
}