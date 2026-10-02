import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { apiClient } from "@/modules/shared/api/api-client";

import {
    SellerDocumentDto,
} from "../dto";

import {
    DocumentType,
} from "../types";

interface UploadDocumentInput {
    file: File;

    documentType: DocumentType;

    documentName?: string;

    documentNumber?: string;
}

export function useUploadDocument() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: async ({
                               file,
                               documentType,
                               documentName,
                               documentNumber,
                           }: UploadDocumentInput) => {
            const formData =
                new FormData();

            formData.append(
                "file",
                file,
            );

            formData.append(
                "documentType",
                documentType,
            );

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

            const response =
                await apiClient.post<SellerDocumentDto>(
                    "/api/seller/verification/documents",
                    formData,
                );

            return response;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    "seller-verification",
                ],
            });
        },
    });
}