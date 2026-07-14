
import {
    findBankAccount, listBankAccounts,
} from "../../seller-profile/repositery";
import {getCurrentSellerOrThrow} from "@/modules/seller/services/get-current-seller-or-throw";
import {deleteUPI_ID} from "@/modules/seller-profile/repositery/delete-upi-id";

export async function deleteUpiIdService(
    accountId: string,
) {


    const {id:sellerId} =
        await getCurrentSellerOrThrow();


    const account =
        await findBankAccount({
            sellerId,
            accountId,
        });

    if (!account || !account?.upiId) {
        throw new Error(
            "UPI id not found.",
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
            "Cannot add UPI ID,this feature is only for the verified account.",
        );
    }

    await deleteUPI_ID({
        sellerId,
        accountId,
    });
}