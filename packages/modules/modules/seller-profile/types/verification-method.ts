import {
    sellerDocumentVerificationMethodEnum,
} from "@/db/schema/seller/seller-document";

export const VerificationMethod =
    Object.fromEntries(
        sellerDocumentVerificationMethodEnum.enumValues.map(
            (value) => [value, value],
        ),
    ) as Record<
        (typeof sellerDocumentVerificationMethodEnum.enumValues)[number],
        (typeof sellerDocumentVerificationMethodEnum.enumValues)[number]
    >;

export type VerificationMethod =
    keyof typeof VerificationMethod;