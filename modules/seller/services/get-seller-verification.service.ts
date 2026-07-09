import { getCurrentSellerOrThrow } from "@/modules/seller/services/get-current-seller-or-throw";
import {
    createSellerVerification,
    findSellerVerification,
    listSellerDocuments
} from "@/modules/seller-profile/repositery";
import {toSellerDocumentDto} from "@/modules/seller-profile/mapper/seller-document-mapper";
import {toSellerVerificationRecord} from "@/modules/seller-profile/mapper/seller-verification-mapper";

export async function getSellerVerificationService() {
    const seller =
        await getCurrentSellerOrThrow();

    let verification =
        await findSellerVerification(
            seller.id,
        );

    if (!verification) {
        verification =
            await createSellerVerification({
                sellerId: seller.id,
            });
    }

    const documents =
        await listSellerDocuments(
            seller.id,
        );

    const requiredDocuments = [
        "GST",
        "PAN",
    ];

    const uploadedRequired =
        documents.filter((doc) =>
            requiredDocuments.includes(
                doc.documentType,
            ),
        ).length;

    const canSubmit =
        uploadedRequired ===
        requiredDocuments.length;

    const completionPercentage =
        Math.round(
            (uploadedRequired /
                requiredDocuments.length) *
            100,
        );

    return {
        verification:
            toSellerVerificationRecord(
                verification,
            ),

        documents:
            documents.map(
                toSellerDocumentDto,
            ),

        completionPercentage,

        canSubmit,

        requiredDocumentsUploaded:
        uploadedRequired,

        requiredDocumentsTotal:
        requiredDocuments.length,
    };
}

// export async function getSellerVerificationService() {
//     const seller =
//         await getCurrentSellerOrThrow();
//
//     let verification =
//         await findSellerVerification(
//             seller.id,
//         );
//
//     if (!verification) {
//         verification =
//             await createSellerVerification({
//                 sellerId: seller.id,
//             });
//     }
//
//     const documents =
//         await listSellerDocuments(
//             seller.id,
//         );
//
//     return {
//         verification:
//             toSellerVerificationRecord(
//                 verification,
//             ),
//
//         documents:
//             documents.map(
//                 toSellerDocumentDto,
//             ),
//     };
// }