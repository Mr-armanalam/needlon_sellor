import { db } from "@/db";
import {sellerBankAccounts} from "@/db/schema/seller/seller-bank-account";

type CreateBankAccountInput =
    typeof sellerBankAccounts.$inferInsert;

export async function createBankAccount(
    values: CreateBankAccountInput,
) {
    const [account] = await db
        .insert(sellerBankAccounts)
        .values(values)
        .returning();

    return account;
}