import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { createDraftProductService } from "@/modules/products/services";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { UnauthorizedError } from "@/modules/shared/errors";

export async function POST(request: NextRequest) {
    return routeHandler(async () => {
        const seller = await getCurrentSeller();
        if (!seller || !seller.id) {
          throw new UnauthorizedError();
        }
        const sellerId = seller.id;

        const draft = await createDraftProductService({
            sellerId,
            storeId: sellerId,
        });

        return successResponse(draft, 201);
    });
}