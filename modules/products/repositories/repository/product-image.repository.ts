import { eq, and, asc } from "drizzle-orm";
import { db } from "@/db";
import { productImagesTable } from "@/db/schema/catalog/products/product-images/table";
import { CreateProductImageDto } from "../../dto/image/product-image.dto";

export class DrizzleProductImageRepository {
  async findByProductId(productId: string) {
    return db
      .select()
      .from(productImagesTable)
      .where(
        and(
          eq(productImagesTable.productId, productId),
          eq(productImagesTable.status, "ACTIVE")
        )
      )
      .orderBy(asc(productImagesTable.displayOrder));
  }

  async findById(imageId: string) {
    const [image] = await db
      .select()
      .from(productImagesTable)
      .where(eq(productImagesTable.id, imageId))
      .limit(1);
    return image ?? null;
  }

  async create(data: CreateProductImageDto) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 7);
    const storageKey = (data as any).storageKey || `media-${timestamp}-${random}`;

    const [image] = await db
      .insert(productImagesTable)
      .values({
        productId: data.productId,
        imageUrl: data.imageUrl,
        storageKey,
        altText: data.altText || null,
        displayOrder: data.displayOrder ?? 0,
        isPrimary: data.isPrimary ?? false,
      })
      .returning();

    return image;
  }

  async delete(imageId: string) {
    await db
      .delete(productImagesTable)
      .where(eq(productImagesTable.id, imageId));
  }

  async updateDisplayOrder(imageId: string, displayOrder: number) {
    await db
      .update(productImagesTable)
      .set({ displayOrder, updatedAt: new Date() })
      .where(eq(productImagesTable.id, imageId));
  }

  async setPrimary(productId: string, imageId: string) {
    // Reset all images of this product to not primary
    await db
      .update(productImagesTable)
      .set({ isPrimary: false, updatedAt: new Date() })
      .where(eq(productImagesTable.productId, productId));

    // Set target image to primary
    const [updated] = await db
      .update(productImagesTable)
      .set({ isPrimary: true, updatedAt: new Date() })
      .where(eq(productImagesTable.id, imageId))
      .returning();

    return updated;
  }
}
