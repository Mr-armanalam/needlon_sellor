import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";

import {
    deleteDocumentService,
    getDocumentPreviewService,
} from "@/modules/seller-profile/services";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: Request,
    { params }: RouteParams,
) {
    return routeHandler(async () => {
        const { id } =
            await params;

        const preview =
            await getDocumentPreviewService({
                documentId: id,
            });

        return successResponse(
            preview,
        );
    });
}

export async function DELETE(
    request: Request,
    { params }: RouteParams,
) {
    return routeHandler(async () => {
        const { id } =
            await params;

        await deleteDocumentService({
            documentId: id,
        });

        return successResponse({
            success: true,
        });
    });
}