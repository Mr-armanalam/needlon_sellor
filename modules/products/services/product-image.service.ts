import "reflect-metadata";
import { injectable } from "tsyringe";
import { DrizzleProductImageRepository } from "../repositories/repository/product-image.repository";
import { CreateProductImageDto } from "../dto/image/product-image.dto";
import { NotFoundError } from "@/modules/shared/errors";

@injectable()
export class ProductImageService {
  constructor(
    private readonly imageRepository: DrizzleProductImageRepository
  ) {}

  async getImages(productId: string) {
    return this.imageRepository.findByProductId(productId);
  }

  async addImage(data: CreateProductImageDto) {
    const existing = await this.imageRepository.findByProductId(data.productId);
    // If first image, automatically set as primary cover
    if (existing.length === 0) {
      data.isPrimary = true;
      data.displayOrder = 0;
    } else if (data.displayOrder === undefined) {
      data.displayOrder = existing.length;
    }
    return this.imageRepository.create(data);
  }

  async deleteImage(imageId: string) {
    const image = await this.imageRepository.findById(imageId);
    if (!image) {
      throw new NotFoundError("Image not found");
    }
    await this.imageRepository.delete(imageId);
    return true;
  }

  async updateOrder(productId: string, imageIds: string[]) {
    for (let i = 0; i < imageIds.length; i++) {
      await this.imageRepository.updateDisplayOrder(imageIds[i], i);
    }
    return this.getImages(productId);
  }

  async setThumbnail(productId: string, imageId: string) {
    const image = await this.imageRepository.findById(imageId);
    if (!image || image.productId !== productId) {
      throw new NotFoundError("Image not found for this product");
    }
    return this.imageRepository.setPrimary(productId, imageId);
  }
}
