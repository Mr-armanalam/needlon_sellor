import { useState } from "react";

import {
    DocumentType,
} from "../types";

import {
    useDeleteDocument,
} from "./use-delete-document";

import {
    useSellerVerification,
} from "./use-seller-verification";

import {
    useSubmitVerification,
} from "./use-submit-verification";

import {
    useUploadDocument,
} from "./use-upload-document";

interface UploadDocumentInput {
    documentType: DocumentType;

    file: File;

    documentNumber?: string;

    documentName?: string;
}

export function useVerificationForm() {
    const verificationQuery =
        useSellerVerification();

    const uploadMutation =
        useUploadDocument();

    const deleteMutation =
        useDeleteDocument();

    const submitMutation =
        useSubmitVerification();

    const [
        uploadingType,
        setUploadingType,
    ] = useState<DocumentType | null>(
        null,
    );

    async function uploadDocument(
        input: UploadDocumentInput,
    ) {
        setUploadingType(
            input.documentType,
        );

        try {
            await uploadMutation.mutateAsync(
                input,
            );
        } finally {
            setUploadingType(
                null,
            );
        }
    }

    async function deleteDocument(
        documentId: string,
    ) {
        await deleteMutation.mutateAsync(
            documentId,
        );
    }

    async function submit() {
        await submitMutation.mutateAsync();
    }

    const isBusy =
        uploadMutation.isPending ||
        deleteMutation.isPending ||
        submitMutation.isPending;

    return {
        verification:
        verificationQuery.data,

        isLoading:
        verificationQuery.isLoading,

        isBusy,

        uploadingType,

        uploadDocument,

        deleteDocument,

        submit,

        refetch:
        verificationQuery.refetch,
    };
}