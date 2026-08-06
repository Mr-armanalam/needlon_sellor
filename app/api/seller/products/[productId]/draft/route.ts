import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getDraftProductService, updateDraftProductService, deleteDraftProductService } from "@/modules/products/services";
import { NextRequest } from "next/server";
import { parseBody } from "@/modules/shared/api/parse-body";
import { updateDraftSchema } from "@/modules/products/validations/draft-product.schema";

interface RouteContext {
    params: Promise<{
        productId: string;
    }>;
}

export async function GET(
    request: Request,
    { params }: RouteContext,
) {
    return routeHandler(async () => {
        const { productId } = await params;
        const draft = await getDraftProductService(productId);
        return successResponse(draft);
    });
}

export async function PATCH(
    request: NextRequest,
    { params }: RouteContext,
) {
    return routeHandler(async () => {
        const { productId } = await params;
        const body = await parseBody(request, updateDraftSchema);
        const draft = await updateDraftProductService(productId, body);
        return successResponse(draft);
    });
}

export async function DELETE(
    request: Request,
    { params }: RouteContext,
) {
    return routeHandler(async () => {
        const { productId } = await params;
        await deleteDraftProductService(productId);
        return successResponse(null);
    });
}