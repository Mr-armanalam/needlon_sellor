import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import {
  getProductImagesService,
  addProductImageService,
  uploadProductMediaToSupabase,
} from "@/modules/products/services";
import { createImageSchema } from "@/modules/products/validations/product-image.schema";

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
    const images = await getProductImagesService(productId);
    return successResponse(images);
  });
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { productId } = await params;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      if (!file) {
        throw new Error("No file provided for upload.");
      }

      const uploadResult = await uploadProductMediaToSupabase({
        productId,
        file,
        fileName: file.name,
        mimeType: file.type || "image/jpeg",
      });

      const displayOrderRaw = formData.get("displayOrder");
      const isPrimaryRaw = formData.get("isPrimary");
      const altTextRaw = formData.get("altText");

      const image = await addProductImageService({
        productId,
        imageUrl: uploadResult.publicUrl,
        fileName: uploadResult.fileName,
        mimeType: uploadResult.mimeType,
        storageKey: uploadResult.storageKey,
        mediaType: uploadResult.mediaType,
        fileSize: file.size,
        displayOrder: displayOrderRaw !== null ? Number(displayOrderRaw) : undefined,
        isPrimary: isPrimaryRaw === "true" || isPrimaryRaw === "1",
        altText: typeof altTextRaw === "string" ? altTextRaw : undefined,
      });

      return successResponse(image, 201);
    }

    // Default JSON handler
    const body = await parseBody(request, createImageSchema);
    const image = await addProductImageService({
      ...body,
      productId,
    });
    return successResponse(image, 201);
  });
}
