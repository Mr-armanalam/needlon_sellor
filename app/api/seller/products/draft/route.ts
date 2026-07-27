import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { DraftProductService } from "@/modules/products/services/draft-product.service";
import { DrizzleProductRepository } from "@/modules/products/repositories/repository/product.repository";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";

const draftProductService = new DraftProductService(new DrizzleProductRepository());

export async function POST(request: NextRequest) {
    return routeHandler(async () => {
        const seller = await getCurrentSeller();
        if (!seller || !seller.id) {
          throw new Error("Unauthorized: Only authenticated sellers can create draft products.");
        }
        const sellerId = seller.id;

        const draft = await draftProductService.createDraft({
            sellerId,
            storeId: sellerId,
        });

        return successResponse(draft, 201);
    });
}