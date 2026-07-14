
import {
    findBankAccount, listBankAccounts,
    updateBankAccount,
} from "../../seller-profile/repositery";
import {getCurrentSellerOrThrow} from "@/modules/seller/services/get-current-seller-or-throw";
import {validateUpiId} from "@/modules/seller-profile/lib/validate-upi-ID";
import {toSellerBankUPI_DTO} from "@/modules/seller-profile/mapper/seller-bank-upi-mapper";

interface setUPI_IDServiceInput {
    accountId: string;
    upiId: string;
}

export async function setUPI_IDService(
    input: setUPI_IDServiceInput,
) {
    const values =
        validateUpiId({
            ...input,
        });

    const seller =
        await getCurrentSellerOrThrow();

    const existing =
        await findBankAccount({
            sellerId: seller.id,
            accountId: input.accountId,
        });

    if (!existing) {
        throw new Error(
            "Bank account not found.",
        );
    }

    const accounts =
        await listBankAccounts({
            sellerId: seller.id,
        });

    const duplicate =
        accounts.find(
            (account) =>
                account.id !== input.accountId &&
                account.upiId === values.upiId,
        );

    if (duplicate) {
        throw new Error(
            "Duplicate bank account or UPI ID.",
        );
    }

    const updated =
        await updateBankAccount({
            sellerId: seller.id,

            accountId:
            input.accountId,

            values: {
                upiId: input.upiId,
            },
        });

    return toSellerBankUPI_DTO(
        updated!,
    );
}