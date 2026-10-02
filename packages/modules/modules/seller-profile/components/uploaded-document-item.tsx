"use client";

import {
    BadgeCheck,
    Clock3,
    Eye,
    Loader2,
    Trash2,
    TriangleAlert,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { SellerDocumentDto } from "../dto";

interface Props {
    document: SellerDocumentDto;

    deleting?: boolean;

    onPreview: () => void;

    onDelete: () => void;
}

const STATUS_CONFIG = {
    UPLOADED: {
        label: "Uploaded",
        icon: Clock3,
        className: "secondary",
    },

    PENDING_REVIEW: {
        label: "Pending Review",
        icon: Clock3,
        className: "secondary",
    },

    UNDER_REVIEW: {
        label: "Under Review",
        icon: Clock3,
        className: "default",
    },

    VERIFIED: {
        label: "Verified",
        icon: BadgeCheck,
        className: "default",
    },

    REJECTED: {
        label: "Rejected",
        icon: XCircle,
        className: "destructive",
    },

    EXPIRED: {
        label: "Expired",
        icon: TriangleAlert,
        className: "outline",
    },
} as const;

export function UploadedDocumentItem({
                                         document,
                                         deleting = false,
                                         onPreview,
                                         onDelete,
                                     }: Props) {
    const status =
        STATUS_CONFIG[
            document.status
            ];

    const Icon =
        status.icon;

    return (
        <div className="flex items-center justify-between rounded-lg border p-4">

            <div className="space-y-2">

                <div className="flex items-center gap-2">

                    <h4 className="font-medium">
                        {document.documentName}
                    </h4>

                    <Badge
                        variant={
                            status.className as
                                | "default"
                                | "secondary"
                                | "destructive"
                                | "outline"
                        }
                    >
                        <Icon className="mr-1 size-3" />

                        {status.label}
                    </Badge>

                </div>

                <div className="text-sm text-muted-foreground space-y-1">

                    <p>
                        Type:{" "}
                        {document.documentType}
                    </p>

                    {document.documentNumber && (
                        <p>
                            Number:{" "}
                            {
                                document.documentNumber
                            }
                        </p>
                    )}

                    <p>
                        Uploaded{" "}
                        {new Date(
                            document.createdAt,
                        ).toLocaleDateString()}
                    </p>

                </div>

                {document.rejectionReason && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {
                            document.rejectionReason
                        }
                    </div>
                )}

            </div>

            <div className="flex items-center gap-2">

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onPreview}
                >
                    <Eye className="size-4" />
                </Button>

                <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    disabled={deleting}
                    onClick={onDelete}
                >
                    {deleting ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Trash2 className="size-4" />
                    )}
                </Button>

            </div>

        </div>
    );
}