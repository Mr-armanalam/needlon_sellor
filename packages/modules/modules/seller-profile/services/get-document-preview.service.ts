import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {findSellerDocument} from "@/modules/seller-profile/repositery";
import {createSignedUrl} from "@/modules/shared/storage/create-signed-url";
import {SELLER_DOCUMENT_BUCKET} from "@/modules/seller-profile/constants";


interface GetDocumentPreviewServiceProps {
    documentId: string;
}

export async function getDocumentPreviewService({
                                                    documentId,
                                                }: GetDocumentPreviewServiceProps) {
    const seller =
        await getCurrentSellerOrThrow();

    const document =
        await findSellerDocument(
            seller.id,
            documentId,
        );

    if (!document) {
        throw new Error(
            "Document not found.",
        );
    }

    const signedUrl =
        await createSignedUrl({
            bucket:
            SELLER_DOCUMENT_BUCKET,

            path:
            document.fileUrl,

            expiresIn:
                60 * 5,
        });

    return {
        url: signedUrl,

        expiresIn:
            60 * 5,
    };
}