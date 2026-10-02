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

export async function getProductImagesService(productId: string) {
  return findProductImagesByProductId(productId);
}

export async function addProductImageService(data: CreateProductImageDto) {
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
