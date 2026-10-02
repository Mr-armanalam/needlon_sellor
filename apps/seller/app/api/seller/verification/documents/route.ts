import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";

import {
    uploadDocumentService,
} from "@/modules/seller-profile/services";

import { DocumentType } from "@/modules/seller-profile/types/document-type";

export async function POST(
    request: Request,
) {
    return routeHandler(async () => {
        const formData =
            await request.formData();

        const file =
            formData.get("file");

        if (!(file instanceof File)) {
            throw new Error(
                "Document is required.",
            );
        }

        const documentType =
            formData.get(
                "documentType",
            ) as DocumentType;

        const documentNumber =
            formData.get(
                "documentNumber",
            )?.toString();

        const documentName =
            formData.get(
                "documentName",
            )?.toString();

        const document =
            await uploadDocumentService({
                file,

                documentType,

                documentNumber,

                documentName,
            });

        return successResponse(
            document,
        );
    });
}