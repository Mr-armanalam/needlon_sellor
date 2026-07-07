
import {
    deleteBankAccount,
    findBankAccount, listBankAccounts,
} from "../../seller-profile/repositery";
import {getCurrentSellerOrThrow} from "@/modules/seller/services/get-current-seller-or-throw";

export async function deleteBankAccountService(
    accountId: string,
) {


    const {id:sellerId} =
        await getCurrentSellerOrThrow();


    const account =
        await findBankAccount({
            sellerId,
            accountId,
        });

    if (!account) {
        throw new Error(
            "Bank account not found.",
        );
    }

    if (account.isPrimary) {
        throw new Error(
            "Primary account cannot be deleted.",
        );
    }

    const accounts =
        await listBankAccounts({
            sellerId,
        });

    const verified =
        accounts.filter(
            (account) =>
                account.verificationStatus ===
                "VERIFIED",
        );

    if (
        verified.length === 1 &&
        verified[0].id ===
        account.id
    ) {
        throw new Error(
            "Cannot delete the only verified payout account.",
        );
    }

    await deleteBankAccount({
        sellerId,
        accountId,
    });
}