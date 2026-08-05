import "reflect-metadata";
import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import { ProductImageService } from "@/modules/products/services/product-image.service";
import { createImageSchema } from "@/modules/products/validations/product-image.schema";
import { DrizzleProductImageRepository } from "@/modules/products/repositories/repository/product-image.repository";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

const productImageService = new ProductImageService(new DrizzleProductImageRepository());

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { productId } = await params;
    const images = await productImageService.getImages(productId);
    return successResponse(images);
  });
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { productId } = await params;
    const body = await parseBody(request, createImageSchema);
    const image = await productImageService.addImage({
      ...body,
      productId,
    });
    return successResponse(image, 201);
  });
}
