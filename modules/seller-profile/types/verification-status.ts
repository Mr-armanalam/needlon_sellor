import {
    sellerDocumentStatusEnum,
} from "@/db/schema/seller/seller-document";

export const VerificationStatus =
    sellerDocumentStatusEnum.enumValues.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            (typeof sellerDocumentStatusEnum.enumValues)[number],
            (typeof sellerDocumentStatusEnum.enumValues)[number]
        >,
    );

export type VerificationStatus =
    keyof typeof VerificationStatus;