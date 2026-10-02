"use client";

import React, { useMemo, useState } from "react";
import { ShieldCheck, Layers } from "lucide-react";
import { DOCUMENT_CONFIG } from "../types/document-config";
import { useVerificationForm } from "../hooks";
import {
    DocumentUploadCard,
    SubmitVerificationCard,
    VerificationEmptyState,
    VerificationSkeleton,
    VerificationStatusCard,
    VerificationTimeline,
} from ".";
import {sellerVerificationApi} from "@/modules/seller-profile/api";

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

    const [documentNumbers, setDocumentNumbers] = useState<Record<string, string>>({});

    const documents = verification?.documents ?? [];

    const documentMap = useMemo(() => {
        return new Map(documents.map((doc) => [doc.documentType, doc]));
    }, [documents]);

    if (isLoading) return <VerificationSkeleton />;
    if (!verification) return <VerificationEmptyState />;

    return (
        <div className="space-y-6 bg-gray-50 p-8 w-full animate-in fade-in duration-200">

            {/* 1. SELLER VERIFICATION HEADER PANEL */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4  pb-4">
                <div className="space-y-0.5">
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Seller Verification</h1>
                    <p className="text-xs text-gray-400 font-medium leading-normal">Upload required documents to verify your business and start selling on Needlon.</p>
                </div>

                {/* Soft trust alert framework header box */}
                <div className="bg-white border border-gray-100 p-3 px-4 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-3 text-xs flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0 stroke-[1.5]" />
                    <div className="leading-tight space-y-0.5 font-semibold">
                        <span className="font-bold text-gray-800 block">Verification helps build trust</span>
                        <span className="text-[11px] text-gray-400 font-normal block">Your data is safe and secure with us</span>
                    </div>
                </div>
            </div>

            {/* 2. COMPACT SIDE-BY-SIDE EQUAL ROW TOP GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                <div className="md:col-span-2">
                    <VerificationStatusCard verification={verification} />
                </div>
                <div className="md:col-span-1">
                    <VerificationTimeline verification={verification} />
                </div>
            </div>

            {/* 3. CONSOLIDATED SINGLE WRAPPER DOCUMENT LIST MODULE */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-4">

                {/* Inside Section Header toolbar info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50 pb-3 text-xs font-semibold">
                    <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0"><Layers className="w-4 h-4 stroke-[1.5]" /></div>
                        <div className="space-y-0.5">
                            <h3 className="text-sm font-bold text-gray-900">Required Documents</h3>
                            <p className="text-[11px] text-gray-400 font-normal">Upload clear and valid documents. All files must be JPG, PNG or PDF (max 5MB).</p>
                        </div>
                    </div>

                    {/* Legend Marker list tags */}
                    <div className="flex items-center gap-4 text-[11px] text-gray-400 font-semibold self-start sm:self-auto">
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Required</span>
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-white border border-gray-300" /> Optional</span>
                    </div>
                </div>

                {/* Clean stacked array items lists row entries */}
                <div className="space-y-2.5">
                    {Object.values(DOCUMENT_CONFIG).map((config) => {
                        const document = documentMap.get(config.documentType);

                        return (
                            <DocumentUploadCard
                                key={config.documentType}
                                title={config.label}
                                documentType={config.documentType}
                                requireNumber={config.requireNumber ?? false}
                                document={document}
                                uploading={uploadingType === config.documentType}
                                disabled={isBusy}
                                documentNumber={documentNumbers[config.documentType] ?? ""}
                                onDocumentNumberChange={(value) =>
                                    setDocumentNumbers((prev) => ({ ...prev, [config.documentType]: value }))
                                }
                                onUpload={(file) =>
                                    uploadDocument({
                                        file,
                                        documentType: config.documentType,
                                        documentName: config.label,
                                        documentNumber: documentNumbers[config.documentType],
                                    })
                                }
                                onDelete={() => document && deleteDocument(document.id)}
                                onPreview={async () => {
                                    const preview =
                                        await sellerVerificationApi.previewDocument(
                                            document?.id ?? '',
                                        );

                                    window.open(
                                        preview.url,
                                        "_blank",
                                    );
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* 4. MASTER ACTION PANEL BASE FOOTER CONTROLS ROW */}
            <SubmitVerificationCard
                verification={verification}
                canSubmit={verification.canSubmit}
                loading={isBusy}
                onSubmit={submit}
            />
        </div>
    );
}




//
// "use client";
//
// import React, { useMemo, useState } from "react";
// import { DOCUMENT_CONFIG } from "../types/document-config";
// import { useVerificationForm } from "../hooks";
// import {
//     DocumentUploadCard,
//     SubmitVerificationCard,
//     VerificationEmptyState,
//     VerificationSkeleton,
//     VerificationStatusCard,
//     VerificationTimeline,
// } from ".";
//
// export function SellerVerificationSection() {
//     const {
//         verification,
//         isLoading,
//         uploadingType,
//         submit,
//         uploadDocument,
//         deleteDocument,
//         isBusy,
//     } = useVerificationForm();
//
//     const [documentNumbers, setDocumentNumbers] = useState<Record<string, string>>({});
//
//     const documents = verification?.documents ?? [];
//
//     const documentMap = useMemo(() => {
//         return new Map(documents.map((doc) => [doc.documentType, doc]));
//     }, [documents]);
//
//     if (isLoading) {
//         return <VerificationSkeleton />;
//     }
//
//     if (!verification) {
//         return <VerificationEmptyState />;
//     }
//
//     return (
//         <div className="space-y-6 max-w-5xl animate-in fade-in duration-200">
//
//             {/* GLOBAL BANNER TITLE STYLES */}
//             <div className="border-b border-gray-100 pb-2">
//                 <h2 className="text-base font-black text-gray-900">Partner Verification Ledger</h2>
//                 <p className="text-xs text-gray-400 mt-0.5">Submit legal identifiers to remove payout threshold boundaries securely.</p>
//             </div>
//
//             {/* CORE TOP SECTION STATUS WRAPPERS */}
//             <VerificationStatusCard verification={verification} />
//             <VerificationTimeline verification={verification} />
//
//             {/* DOCUMENT ENTRY CARD WORKSPACE SPLIT GRID */}
//             <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
//                 {Object.values(DOCUMENT_CONFIG).map((config) => {
//                     const document = documentMap.get(config.documentType);
//
//                     return (
//                         <DocumentUploadCard
//                             key={config.documentType}
//                             title={config.label}
//                             documentType={config.documentType}
//                             requireNumber={config.requireNumber ?? false}
//                             document={document}
//                             uploading={uploadingType === config.documentType}
//                             disabled={isBusy}
//                             documentNumber={documentNumbers[config.documentType] ?? ""}
//                             onDocumentNumberChange={(value) =>
//                                 setDocumentNumbers((prev) => ({
//                                     ...prev,
//                                     [config.documentType]: value,
//                                 }))
//                             }
//                             onUpload={(file) =>
//                                 uploadDocument({
//                                     file,
//                                     documentType: config.documentType,
//                                     documentName: config.label,
//                                     documentNumber: documentNumbers[config.documentType],
//                                 })
//                             }
//                             onDelete={() => document && deleteDocument(document.id)}
//                             onPreview={() => window.open(document?.fileUrl, "_blank")}
//                         />
//                     );
//                 })}
//             </div>
//
//             {/* FINALIZE BLOCK BUTTON ROW */}
//             <SubmitVerificationCard
//                 verification={verification}
//                 canSubmit={verification.canSubmit}
//                 loading={isBusy}
//                 onSubmit={submit}
//             />
//         </div>
//     );
// }