import "reflect-metadata";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import {DraftProductService} from "@/modules/products/services/draft-product.service";
import { DrizzleProductRepository } from "@/modules/products/repositories/repository/product.repository";
import { NextRequest } from "next/server";

import { parseBody } from "@/modules/shared/api/parse-body";
import {updateDraftSchema} from "@/modules/products/validations/draft-product.schema";


interface RouteContext {
    params: Promise<{
        productId: string;
    }>;
}



// const draftProductService =
//     new DraftProductService();

const draftProductService =
    new DraftProductService(new DrizzleProductRepository());

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
        const { productId } =
            await params;

        const draft =
            await draftProductService.getDraft(
                productId,
            );

        return successResponse(draft);
    });
}



export async function PATCH(
    request: NextRequest,
    { params }: RouteContext,
) {
    return routeHandler(async () => {
        const { productId } =
            await params;

        const body =
            await parseBody(
                request,
                updateDraftSchema,
            );

        const draft =
            await draftProductService.updateDraft(
                productId,
                body,
            );

        return successResponse(draft);
    });
}


export async function DELETE(
    request: Request,
    { params }: RouteContext,
) {
    return routeHandler(async () => {
        const { productId } =
            await params;

        await draftProductService.deleteDraft(
            productId,
        );

        return successResponse(null);
    });
}