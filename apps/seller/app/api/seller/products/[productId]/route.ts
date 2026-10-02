import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { deleteProductService } from "@/modules/products/services/delete-product.service";
import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services";
import { getProductByIdService } from "@/modules/products/services/get-product-by-id.service";
import { getProduct } from "@/modules/products/repository";
import { ForbiddenError } from "@/modules/shared/errors";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { productId } = await params;
    const seller = await getCurrentSellerOrThrow();
    const product = await getProductByIdService(productId, seller);
    return successResponse(product);
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { productId } = await params;

    const seller = await getCurrentSellerOrThrow();
    const existing = await getProduct(productId);
    if (existing && existing.storeId !== seller.id && seller.role !== "admin") {
      throw new ForbiddenError("You do not have permission to delete this product.");
    }

    const deleted = await deleteProductService(productId);
    return successResponse(deleted);
  });
}
