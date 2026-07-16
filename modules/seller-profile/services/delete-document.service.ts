import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {deleteSellerDocument, findSellerDocument} from "@/modules/seller-profile/repositery";
import {deleteStorageFile} from "@/modules/shared/storage/delete-storage-file";
import {SELLER_DOCUMENT_BUCKET} from "@/modules/seller-profile/constants";
import {extractPStoragePath} from "@/modules/shared/storage/extract-pstorage-path";


interface DeleteDocumentServiceProps {
    documentId: string;
}

export async function deleteDocumentService({
                                                documentId,
                                            }: DeleteDocumentServiceProps) {
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

    await deleteStorageFile({
        bucket:
        SELLER_DOCUMENT_BUCKET,

        path:
            extractPStoragePath(
                document.fileUrl,
            ),
    });

    await deleteSellerDocument(
        {documentId: document.id,
            sellerId: seller.id
        }
    );

    return {
        success: true,
    };
}