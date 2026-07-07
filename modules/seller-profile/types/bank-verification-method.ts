import {bankVerificationMethodEnum} from "@/db/schema/seller/seller-bank-account";


export const BankVerificationMethod =
    bankVerificationMethodEnum.enumValues.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            (typeof bankVerificationMethodEnum.enumValues)[number],
            (typeof bankVerificationMethodEnum.enumValues)[number]
        >,
    );

export type BankVerificationMethod =
    keyof typeof BankVerificationMethod;