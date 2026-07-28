import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {
    findSellerVerification,
    listSellerDocuments,
    updateSellerVerification
} from "@/modules/seller-profile/repositery";

import { SellerVerificationStatus } from "@/modules/seller-profile/types/seller-verification-status";

import type {
    DocumentType,
} from "@/modules/seller-profile/types";
import {toSellerVerificationRecord} from "@/modules/seller-profile/mapper/seller-verification-mapper";

const REQUIRED_DOCUMENTS: DocumentType[] = [
    'PAN' as DocumentType,
];

export async function submitVerificationService() {
    const seller =
        await getCurrentSellerOrThrow();

    const verification =
        await findSellerVerification(
            seller.id,
        );

    if (!verification) {
        throw new Error(
            "Verification record not found.",
        );
    }

    const documents =
        await listSellerDocuments(
            seller.id,
        );

    if (!documents.length) {
        throw new Error(
            "Please upload the required documents.",
        );
    }

    for (const type of REQUIRED_DOCUMENTS) {
        const exists =
            documents.some(
                (document) =>
                    document.documentType ===
                    type,
            );

        if (!exists) {
            throw new Error(
                `${type} document is required.`,
            );
        }
    }

    const updated =
        await updateSellerVerification({
            sellerId: seller.id,
            data: {
                status:
                SellerVerificationStatus.PENDING,

                submittedAt:
                    new Date(),

                rejectionReason:
                    null,

                reviewNotes:
                    null,
            },
        });

    return toSellerVerificationRecord(
        updated,
    );
}