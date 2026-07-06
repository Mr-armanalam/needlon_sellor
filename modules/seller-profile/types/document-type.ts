import {
    sellerDocumentTypeEnum,
} from "@/db/schema/seller/seller-document";

export const DocumentType =
    sellerDocumentTypeEnum.enumValues.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            (typeof sellerDocumentTypeEnum.enumValues)[number],
            (typeof sellerDocumentTypeEnum.enumValues)[number]
        >,
    );

export type DocumentType =
    keyof typeof DocumentType;