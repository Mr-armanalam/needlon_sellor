import {
    DocumentType,
    VerificationMethod,
    VerificationStatus,
} from "../types";

export interface SellerDocumentDto {
    id: string;

    sellerId: string;

    documentType: DocumentType;

    documentNumber: string | null;

    documentName: string | null;

    fileUrl: string;

    mimeType: string | null;

    fileSizeBytes: number | null;

    status:  VerificationStatus;

    verificationMethod: VerificationMethod;

    verifiedAt: string | null;

    rejectionReason: string | null;

    expiresAt: string | null;

    isPrimary: boolean;

    createdAt: string;

    updatedAt: string;
}