"use client";

import React, { useRef } from "react";
import {FileText, Upload, AlertCircle, CheckCircle2, Loader2, Trash2} from "lucide-react";
import { DocumentType } from "../types";
import { SellerDocumentDto } from "../dto";
import { cn } from "@/lib/utils";

interface Props {
    title: string;

    description?: string;

    documentType: DocumentType;

    document?: SellerDocumentDto;

    uploading: boolean;

    deleting?: boolean;

    disabled?: boolean;

    requireNumber?: boolean;

    documentNumber?: string;

    onDocumentNumberChange?: (
        value: string,
    ) => void;

    onUpload: (
        file: File,
    ) => void;

    onDelete: () => void;

    onPreview: () => void;
}
export function DocumentUploadCard({
                                       title,
                                       document,
                                       uploading,
                                       deleting = false,
                                       disabled = false,
                                       requireNumber = false,
                                       documentNumber,
                                       onDocumentNumberChange,
                                       onUpload,
                                       onDelete,
                                       onPreview,
                                       documentType
                                   }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const isRequired = documentType === "GST" || documentType === "PAN";

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        onUpload(file);

        event.target.value = "";
    }



    return (
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100 rounded-xl bg-white hover:bg-slate-50/30 transition-all text-xs font-semibold">

            {/* Left Column: Icon + Document Metadata */}
            <div className="flex items-center gap-3.5 min-w-0">
                <div className={cn(
                    "p-3 rounded-xl border shrink-0",
                    isRequired ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-purple-50 text-purple-600 border-purple-100"
                )}>
                    <FileText className="w-4 h-4" />
                </div>

                <div className="min-w-0 space-y-0.5">
                    <h4 className="font-bold text-gray-900 flex items-center gap-1">
                        {title}
                        {isRequired && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium truncate">
                        Upload your {title.toLowerCase()} documents
                    </p>
                </div>
                {requireNumber && (
                    <div className="space-y-2">
                        <input
                            value={ documentNumber ??  ''  }
                            type={"string"}
                            placeholder={"0"}
                            className={'bg-white border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 dark:bg-gray-700 text-green-700 w-8'}
                            disabled={ disabled }
                            onChange={( e,) =>
                                onDocumentNumberChange?.( e.target.value, )
                            }
                        />
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                hidden
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleChange}
            />

            {/* Right Column: Dynamic Status Indicators & Trigger Buttons */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-between sm:justify-end flex-shrink-0">

                {/* Center Mode Label */}
                <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border",
                    isRequired ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-gray-100 text-gray-500 border-gray-200"
                )}>
                    {isRequired ? "Required" : "Optional"}
                  </span>

                {/* Dynamic File Status Marker */}
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                    {document ? (
                        <div  className={'flex gap-x-4'}>

                            <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Attached</span>
                            <div className="flex  gap-2">

                                <button
                                    type="button"
                                    onClick={onPreview}
                                    className={'hover:text-black'}
                                >
                                    Preview
                                </button>

                                <button
                                    type="button"
                                    disabled={deleting}
                                    onClick={onDelete}
                                    className={'hover:text-black'}
                                >
                                    {deleting ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="size-4" />
                                    )}
                                </button>

                            </div>
                        </div>
                    ) : (
                        <span className="text-gray-400 flex  items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-gray-300" /> Not Uploaded</span>
                    )}
                </div>

                {/* Action Trigger Button */}
                <button
                    type="button"
                    disabled={uploading || disabled}
                    onClick={() => inputRef.current?.click()}
                    className="border border-blue-200 hover:bg-blue-50/50 text-blue-600 font-bold px-4 py-2 rounded-xl shadow-xs transition-colors bg-white flex items-center gap-1.5"
                >
                    <Upload className="w-3.5 h-3.5" />
                    {uploading ? "Uploading..." : "Upload"}
                </button>

            </div>
        </div>
    );
}




// "use client";
//
// import { useRef } from "react";
//
// import {
//     FileText,
//     Loader2,
//     Trash2,
//     UploadCloud,
// } from "lucide-react";
//
// import { Button } from "@/components/ui/button";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
//
// import {
//     SellerDocumentDto,
// } from "../dto";
//
// import {
//     DocumentType,
// } from "../types";
//
// interface Props {
//     title: string;
//
//     description?: string;
//
//     documentType: DocumentType;
//
//     document?: SellerDocumentDto;
//
//     uploading: boolean;
//
//     deleting?: boolean;
//
//     disabled?: boolean;
//
//     requireNumber?: boolean;
//
//     documentNumber?: string;
//
//     onDocumentNumberChange?: (
//         value: string,
//     ) => void;
//
//     onUpload: (
//         file: File,
//     ) => void;
//
//     onDelete: () => void;
//
//     onPreview: () => void;
// }
//
// export function DocumentUploadCard({
//                                        title,
//                                        description,
//                                        document,
//                                        uploading,
//                                        deleting = false,
//                                        disabled = false,
//                                        requireNumber = false,
//                                        documentNumber,
//                                        onDocumentNumberChange,
//                                        onUpload,
//                                        onDelete,
//                                        onPreview,
//                                    }: Props) {
//     const inputRef =
//         useRef<HTMLInputElement>(null);
//
//     function openPicker() {
//         if (
//             uploading ||
//             disabled
//         ) {
//             return;
//         }
//
//         inputRef.current?.click();
//     }
//
//     function handleChange(
//         event: React.ChangeEvent<HTMLInputElement>,
//     ) {
//         const file =
//             event.target.files?.[0];
//
//         if (!file) {
//             return;
//         }
//
//         onUpload(file);
//
//         event.target.value = "";
//     }
//
//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>
//                     {title}
//                 </CardTitle>
//
//                 {description && (
//                     <p className="text-sm text-muted-foreground">
//                         {description}
//                     </p>
//                 )}
//             </CardHeader>
//
//             <CardContent className="space-y-5">
//
//                 {requireNumber && (
//                     <div className="space-y-2">
//                         <Label>
//                             Document Number
//                         </Label>
//
//                         <Input
//                             value={
//                                 documentNumber ??
//                                 ""
//                             }
//                             disabled={
//                                 disabled
//                             }
//                             onChange={(
//                                 e,
//                             ) =>
//                                 onDocumentNumberChange?.(
//                                     e.target
//                                         .value,
//                                 )
//                             }
//                         />
//                     </div>
//                 )}
//
//                 <input
//                     ref={inputRef}
//                     type="file"
//                     hidden
//                     accept=".pdf,.jpg,.jpeg,.png,.webp"
//                     onChange={
//                         handleChange
//                     }
//                 />
//
//                 {!document ? (
//                     <Button
//                         type="button"
//                         variant="outline"
//                         className="w-full h-28 border-dashed"
//                         disabled={
//                             uploading ||
//                             disabled
//                         }
//                         onClick={
//                             openPicker
//                         }
//                     >
//                         {uploading ? (
//                             <>
//                                 <Loader2 className="mr-2 size-4 animate-spin" />
//
//                                 Uploading...
//                             </>
//                         ) : (
//                             <>
//                                 <UploadCloud className="mr-2 size-5" />
//
//                                 Upload Document
//                             </>
//                         )}
//                     </Button>
//                 ) : (
//                     <div className="rounded-lg border p-4">
//                         <div className="flex items-center justify-between">
//
//                             <div className="flex items-center gap-3">
//
//                                 <FileText className="size-5 text-primary" />
//
//                                 <div>
//                                     <p className="font-medium">
//                                         {
//                                             document.documentName
//                                         }
//                                     </p>
//
//                                     <p className="text-sm text-muted-foreground">
//                                         {
//                                             document.documentType
//                                         }
//                                     </p>
//                                 </div>
//
//                             </div>
//
//                             <div className="flex gap-2">
//
//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     onClick={
//                                         onPreview
//                                     }
//                                 >
//                                     Preview
//                                 </Button>
//
//                                 <Button
//                                     type="button"
//                                     variant="destructive"
//                                     disabled={
//                                         deleting
//                                     }
//                                     onClick={
//                                         onDelete
//                                     }
//                                 >
//                                     {deleting ? (
//                                         <Loader2 className="size-4 animate-spin" />
//                                     ) : (
//                                         <Trash2 className="size-4" />
//                                     )}
//                                 </Button>
//
//                             </div>
//
//                         </div>
//                     </div>
//                 )}
//
//             </CardContent>
//         </Card>
//     );
// }