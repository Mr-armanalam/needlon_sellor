import {
  findProductImagesByProductId,
  findProductImageById,
  createProductImage,
  deleteProductImage,
  updateProductImageDisplayOrder,
  setPrimaryProductImage,
} from "../repository";
import { CreateProductImageDto } from "../dto";
import { NotFoundError } from "@/modules/shared/errors";
import { supabaseServer } from "@/lib/supabase/server";
import { PRODUCT_MEDIA_BUCKET } from "../constants/media";
import { uploadProductMediaDataUrlToSupabase } from "./upload-product-media.service";

export async function getProductImagesService(productId: string) {
  return findProductImagesByProductId(productId);
}

export async function addProductImageService(data: CreateProductImageDto) {
  // If data.imageUrl is a base64 data URL, upload to Supabase Storage first to prevent DB bloat
  if (data.imageUrl && data.imageUrl.startsWith("data:")) {
    try {
      const uploadRes = await uploadProductMediaDataUrlToSupabase(
        data.productId,
        data.imageUrl,
        data.fileName
      );
      data.imageUrl = uploadRes.publicUrl;
      data.storageKey = uploadRes.storageKey;
      data.mediaType = uploadRes.mediaType;
    } catch (uploadErr) {
      console.warn("Failed converting data URL to Supabase storage:", uploadErr);
    }
  }

  const existing = await findProductImagesByProductId(data.productId);
  // If first image, automatically set as primary cover
  if (existing.length === 0) {
    data.isPrimary = true;
    data.displayOrder = 0;
  } else if (data.displayOrder === undefined) {
    data.displayOrder = existing.length;
  }
  return createProductImage(data);
}

export async function deleteProductImageService(imageId: string) {
  const image = await findProductImageById(imageId);
  if (!image) {
    throw new NotFoundError("Image not found");
  }

  // Remove underlying asset from Supabase Storage bucket if storageKey is known
  if (image.storageKey) {
    try {
      const client = typeof supabaseServer === "function" ? (supabaseServer as any)() : supabaseServer;
      if (client?.storage) {
        await client.storage.from(PRODUCT_MEDIA_BUCKET).remove([image.storageKey]);
      }
    } catch (storageErr) {
      console.warn("Failed removing storage file from Supabase:", storageErr);
    }
  }

  await deleteProductImage(imageId);
  return true;
}

export async function reorderProductImagesService(productId: string, imageIds: string[]) {
  for (let i = 0; i < imageIds.length; i++) {
    await updateProductImageDisplayOrder(imageIds[i], i);
  }
  return getProductImagesService(productId);
}

export async function setPrimaryThumbnailService(productId: string, imageId: string) {
  const image = await findProductImageById(imageId);
  if (!image || image.productId !== productId) {
    throw new NotFoundError("Image not found for this product");
  }
  return setPrimaryProductImage(productId, imageId);
}

/**
 * Legacy class wrapper for backward compatibility with existing tests
 */
export class ProductImageService {
  async getImages(productId: string) {
    return getProductImagesService(productId);
  }
  async addImage(data: CreateProductImageDto) {
    return addProductImageService(data);
  }
  async deleteImage(imageId: string) {
    return deleteProductImageService(imageId);
  }
  async updateOrder(productId: string, imageIds: string[]) {
    return reorderProductImagesService(productId, imageIds);
  }
  async setThumbnail(productId: string, imageId: string) {
    return setPrimaryThumbnailService(productId, imageId);
  }
}
