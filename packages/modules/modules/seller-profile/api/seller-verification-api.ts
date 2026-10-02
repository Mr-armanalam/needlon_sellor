import { apiClient } from "@/modules/shared/api/api-client";

import {
    SellerDocumentDto,
    SellerVerificationDto,
} from "../dto";

import {
    DocumentType,
} from "../types";

interface UploadDocumentRequest {
    file: File;
    documentType: DocumentType;
    documentName?: string;
    documentNumber?: string;
}

export const sellerVerificationApi = {
    get() {
        return apiClient.get<SellerVerificationDto>(
            "/api/seller/verification",
        );
    },

    submit() {
        return apiClient.post<SellerVerificationDto>(
            "/api/seller/verification/submit",
        );
    },

    uploadDocument({
                       file,
                       documentType,
                       documentName,
                       documentNumber,
                   }: UploadDocumentRequest) {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("documentType", documentType);

        if (documentName) {
            formData.append(
                "documentName",
                documentName,
            );
        }

        if (documentNumber) {
            formData.append(
                "documentNumber",
                documentNumber,
            );
        }

        return apiClient.post<SellerDocumentDto>(
            "/api/seller/verification/documents",
            formData,
        );
    },

    deleteDocument(
        documentId: string,
    ) {
        return apiClient.delete<void>(
            `/api/seller/verification/documents/${documentId}`,
        );
    },

    previewDocument(
        documentId: string,
    ) {
        return apiClient.get<{
            url: string;
            expiresIn: number;
        }>(
            `/api/seller/verification/documents/${documentId}`,
        );
    },
};