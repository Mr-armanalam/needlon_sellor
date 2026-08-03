import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import {getCurrentSellerOrThrow} from "@/modules/seller-profile/services";
import {bulkProductsUploadServices} from "@/modules/products/services/bulk-products-upload.services";

export async function POST(request: NextRequest) {
  return routeHandler(async () => {
    const { products: items } = await request.json();
    if (!Array.isArray(items)) {
      throw new Error("Invalid payload: 'products' must be an array.");
    }
    const seller = await getCurrentSellerOrThrow();
    const uploaded = await bulkProductsUploadServices(seller, items);

    return successResponse({ success: true, count: uploaded.length, items: uploaded }, 201);
  });
}
