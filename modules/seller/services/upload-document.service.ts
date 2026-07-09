import { getCurrentSellerOrThrow } from "@/modules/seller/services/get-current-seller-or-throw";
import {replaceStorageFile} from "@/modules/shared/storage/replace-storage-file";
import {createSellerDocument} from "@/modules/seller-profile/repositery/create-seller-document";
import {updateSellerDocument} from "@/modules/seller-profile/repositery/update-seller-document";
import {toSellerDocumentDto} from "@/modules/seller-profile/mapper/seller-document-mapper";
import { VerificationStatus } from "@/modules/seller-profile/types/verification-status";
import { VerificationMethod } from "@/modules/seller-profile/types/verification-method";
import { validateDocument } from "@/modules/seller-profile/lib/validate-document";
import { SELLER_DOCUMENT_BUCKET, SELLER_DOCUMENT_FOLDER, } from "@/modules/seller-profile/constants";
import {
    DocumentType,
} from "@/modules/seller-profile/types";
import {findSellerDocumentByType} from "@/modules/seller-profile/repositery/find-seller-document-by-type";


interface UploadDocumentServiceProps {
    documentType: DocumentType;

    documentNumber?: string;

    documentName?: string;
    file: File;
}

export async function uploadDocumentService({
                                                documentType,
                                                documentNumber,
                                                documentName,
                                                file,
                                            }: UploadDocumentServiceProps) {
    await validateDocument(file);

    const seller =
        await getCurrentSellerOrThrow();

    const existingDocument =
        await findSellerDocumentByType(
            seller.id,
            documentType,
        );

    const fileUrl =
        await replaceStorageFile({
            bucket:
            SELLER_DOCUMENT_BUCKET,

            folder:
                `${SELLER_DOCUMENT_FOLDER}/${seller.id}/${documentType.toLowerCase()}`,

            previousUrl:
            existingDocument?.fileUrl,

            file,
        });

    if (existingDocument) {
        const updated =
            await updateSellerDocument({
                sellerId:
                seller.id,

                documentId:
                existingDocument.id,

                data: {
                    documentNumber,

                    documentName,

                    fileUrl,

                    mimeType:
                    file.type,

                    fileSizeBytes:
                    file.size,

                    status:
                    VerificationStatus.PENDING_REVIEW,

                    verificationMethod:
                    VerificationMethod.MANUAL,

                    rejectionReason:
                        null,

                    verifiedAt:
                        null,

                    verifiedBy:
                        null,

                    expiresAt:
                        null,
                },
            });

        return toSellerDocumentDto(
            updated,
        );
    }

    const created =
        await createSellerDocument({
            sellerId:
            seller.id,

            documentType,

            documentNumber,

            documentName,

            fileUrl,

            mimeType:
            file.type,

            fileSizeBytes:
            file.size,

            status:
            VerificationStatus.PENDING_REVIEW,

            verificationMethod:
            VerificationMethod.MANUAL,

            isPrimary:
                true,
        });

    return toSellerDocumentDto(
        created,
    );
}