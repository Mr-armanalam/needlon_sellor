"use client";

import { useRef } from "react";

import {
    FileText,
    Loader2,
    Trash2,
    UploadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    SellerDocumentDto,
} from "../dto";

import {
    DocumentType,
} from "../types";

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
                                       description,
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
                                   }: Props) {
    const inputRef =
        useRef<HTMLInputElement>(null);

    function openPicker() {
        if (
            uploading ||
            disabled
        ) {
            return;
        }

        inputRef.current?.click();
    }

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
        <Card>
            <CardHeader>
                <CardTitle>
                    {title}
                </CardTitle>

                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </CardHeader>

            <CardContent className="space-y-5">

                {requireNumber && (
                    <div className="space-y-2">
                        <Label>
                            Document Number
                        </Label>

                        <Input
                            value={
                                documentNumber ??
                                ""
                            }
                            disabled={
                                disabled
                            }
                            onChange={(
                                e,
                            ) =>
                                onDocumentNumberChange?.(
                                    e.target
                                        .value,
                                )
                            }
                        />
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={
                        handleChange
                    }
                />

                {!document ? (
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-28 border-dashed"
                        disabled={
                            uploading ||
                            disabled
                        }
                        onClick={
                            openPicker
                        }
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />

                                Uploading...
                            </>
                        ) : (
                            <>
                                <UploadCloud className="mr-2 size-5" />

                                Upload Document
                            </>
                        )}
                    </Button>
                ) : (
                    <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                <FileText className="size-5 text-primary" />

                                <div>
                                    <p className="font-medium">
                                        {
                                            document.documentName
                                        }
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {
                                            document.documentType
                                        }
                                    </p>
                                </div>

                            </div>

                            <div className="flex gap-2">

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={
                                        onPreview
                                    }
                                >
                                    Preview
                                </Button>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    disabled={
                                        deleting
                                    }
                                    onClick={
                                        onDelete
                                    }
                                >
                                    {deleting ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="size-4" />
                                    )}
                                </Button>

                            </div>

                        </div>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}