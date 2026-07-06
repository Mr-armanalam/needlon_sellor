"use client";

import { useMemo, useState } from "react";

import { DOCUMENT_CONFIG } from "../types/document-config";

import {
    DocumentUploadCard,
    SubmitVerificationCard,
    VerificationEmptyState,
    VerificationSkeleton,
    VerificationStatusCard,
    VerificationTimeline,
} from ".";

import { useVerificationForm } from "../hooks";

export function SellerVerificationSection() {
    const {
        verification,
        isLoading,
        uploadingType,
        submit,
        uploadDocument,
        deleteDocument,
        isBusy,
    } = useVerificationForm();

    const [
        documentNumbers,
        setDocumentNumbers,
    ] = useState<
        Record<string, string>
    >({});

    const documents =
        verification?.documents ?? [];

    const verificationRecord =
        verification?.verification;

    const documentMap =
        useMemo(() => {
            return new Map(
                documents.map((doc) => [
                    doc.documentType,
                    doc,
                ]),
            );
        }, [documents]);

    if (isLoading) {
        return (
            <VerificationSkeleton />
        );
    }

    if (
        !verification ||
        !verificationRecord
    ) {
        return (
            <VerificationEmptyState />
        );
    }

    return (
        <div className="space-y-8">

            <VerificationStatusCard
                verification={
                    verification
                }
            />

            <VerificationTimeline
                verification={
                    verification
                }
            />

            <div className="grid gap-6 lg:grid-cols-2">

                {Object.values(
                    DOCUMENT_CONFIG,
                ).map((config) => {
                    const document =
                        documentMap.get(
                            config.documentType,
                        );

                    return (
                        <DocumentUploadCard
                            key={
                                config.documentType
                            }
                            title={
                                config.label
                            }
                            documentType={
                                config.documentType
                            }
                            requireNumber={
                                config.requireNumber ??
                                false
                            }
                            document={
                                document
                            }
                            uploading={
                                uploadingType ===
                                config.documentType
                            }
                            disabled={
                                isBusy
                            }
                            documentNumber={
                                documentNumbers[
                                    config.documentType
                                    ] ?? ""
                            }
                            onDocumentNumberChange={(
                                value,
                            ) =>
                                setDocumentNumbers(
                                    (
                                        prev,
                                    ) => ({
                                        ...prev,
                                        [
                                            config.documentType
                                            ]:
                                        value,
                                    }),
                                )
                            }
                            onUpload={(
                                file,
                            ) =>
                                uploadDocument(
                                    {
                                        file,
                                        documentType:
                                        config.documentType,
                                        documentName:
                                        config.label,
                                        documentNumber:
                                            documentNumbers[
                                                config.documentType
                                                ],
                                    },
                                )
                            }
                            onDelete={() =>
                                document &&
                                deleteDocument(
                                    document.id,
                                )
                            }
                            onPreview={() =>
                                window.open(
                                    document?.fileUrl,
                                    "_blank",
                                )
                            }
                        />
                    );
                })}

            </div>

            <SubmitVerificationCard
                verification={
                    verification
                }
                canSubmit={
                    verification.canSubmit
                }
                loading={
                    isBusy
                }
                onSubmit={
                    submit
                }
            />

        </div>
    );
}