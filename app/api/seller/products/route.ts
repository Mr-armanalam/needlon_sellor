import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/modules/shared/api/error-response";
import {getCurrentSellerOrThrow} from "@/modules/seller-profile/services";
import {getFilteredProductsService} from "@/modules/products/services/get-filtered-products.service";

export async function GET(req: NextRequest) {
  try {
    const seller = await getCurrentSellerOrThrow();
    const sellerId = seller.id;
    const { searchParams } = new URL(req.url);
    const productMap = await getFilteredProductsService(searchParams, sellerId);
    const items = Array.from(productMap.values());

    return NextResponse.json({
      success: true,
      data: {
        items,
        nextCursor: null,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
