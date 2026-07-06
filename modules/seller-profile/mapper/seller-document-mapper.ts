
import { SellerDocumentDto } from "../dto";
import {sellerDocuments} from "@/db/schema/seller/seller-document";

type SellerDocumentRecord =
    typeof sellerDocuments.$inferSelect;

export function toSellerDocumentDto(
    document: SellerDocumentRecord,
): SellerDocumentDto {
    return {
        id: document.id,

        sellerId: document.sellerId,

        documentType:
        document.documentType,

        documentNumber:
        document.documentNumber,

        documentName:
        document.documentName,

        fileUrl:
        document.fileUrl,

        mimeType:
        document.mimeType,

        fileSizeBytes:
        document.fileSizeBytes,

        status:
        document.status,

        verificationMethod:
        document.verificationMethod,

        verifiedAt:
            document.verifiedAt?.toISOString() ??
            null,

        rejectionReason:
        document.rejectionReason,

        expiresAt:
            document.expiresAt?.toISOString() ??
            null,

        isPrimary:
        document.isPrimary,

        createdAt:
            document.createdAt.toISOString(),

        updatedAt:
            document.updatedAt.toISOString(),
    };
}