import { z } from "zod";

import { AccountType } from "../types/account-type";

import {
    ACCOUNT_NUMBER_MAX_LENGTH,
    ACCOUNT_NUMBER_MIN_LENGTH,
    ACCOUNT_HOLDER_NAME_MAX_LENGTH,
    BANK_NAME_MAX_LENGTH,
    BRANCH_NAME_MAX_LENGTH,
    IFSC_REGEX,
} from "../constants";

export const bankAccountSchema =
    z.object({
        accountHolderName:
            z
                .string()
                .trim()
                .min(2)
                .max(
                    ACCOUNT_HOLDER_NAME_MAX_LENGTH,
                ),

        bankName:
            z
                .string()
                .trim()
                .min(2)
                .max(
                    BANK_NAME_MAX_LENGTH,
                ),

        accountNumber:
            z
                .string()
                .trim()
                .min(
                    ACCOUNT_NUMBER_MIN_LENGTH,
                )
                .max(
                    ACCOUNT_NUMBER_MAX_LENGTH,
                ),

        confirmAccountNumber:
            z.string(),

        ifscCode:
            z
                .string()
                .trim()
                .toUpperCase()
                .regex(
                    IFSC_REGEX,
                    "Invalid IFSC code.",
                ),

        branchName:
            z
                .string()
                .trim()
                .max(
                    BRANCH_NAME_MAX_LENGTH,
                )
                .optional(),

        accountType:
            z.nativeEnum(AccountType),
    })
        .refine(
            (data) =>
                data.accountNumber ===
                data.confirmAccountNumber,
            {
                path: [
                    "confirmAccountNumber",
                ],
                message:
                    "Account numbers do not match.",
            },
        );

export type BankAccountFormValues =
    z.infer<
        typeof bankAccountSchema
    >;