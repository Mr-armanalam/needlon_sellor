import "reflect-metadata";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import {
  isAllowedMediaMimeType,
  getMediaTypeFromMime,
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_VIDEO_MIME_TYPES,
  PRODUCT_MEDIA_BUCKET,
} from "./constants/media";
import { createImageSchema } from "./validations/product-image.schema";

async function runMediaUploadTests() {
  console.log("🚀 Starting Product Media Upload & Storage Test Suite...\n");

  // 1. Verify MIME Types Validator
  console.log("1. Testing MIME Types Validator...");
  for (const imgMime of ALLOWED_IMAGE_MIME_TYPES) {
    if (!isAllowedMediaMimeType(imgMime)) {
      throw new Error(`Expected image MIME type '${imgMime}' to be accepted!`);
    }
  }

  for (const vidMime of ALLOWED_VIDEO_MIME_TYPES) {
    if (!isAllowedMediaMimeType(vidMime)) {
      throw new Error(`Expected video MIME type '${vidMime}' to be accepted!`);
    }
  }

  // Additional modern formats (e.g., avif, webp, heic, mov)
  const additionalFormats = [
    "image/avif",
    "image/webp",
    "image/jpeg",
    "image/png",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];
  for (const fmt of additionalFormats) {
    if (!isAllowedMediaMimeType(fmt)) {
      throw new Error(`Expected format '${fmt}' to be accepted!`);
    }
  }

  // Disallowed formats
  const disallowed = ["application/pdf", "text/plain", "application/zip", "application/octet-stream", ""];
  for (const dis of disallowed) {
    if (isAllowedMediaMimeType(dis)) {
      throw new Error(`Expected disallowed MIME type '${dis}' to be rejected!`);
    }
  }
  console.log("✅ MIME type validation passed (All image and video types accepted).");

  // 2. Verify Media Type Resolution
  console.log("\n2. Testing getMediaTypeFromMime resolution...");
  if (getMediaTypeFromMime("image/avif") !== "IMAGE") {
    throw new Error("Expected image/avif to resolve to 'IMAGE'");
  }
  if (getMediaTypeFromMime("image/webp") !== "IMAGE") {
    throw new Error("Expected image/webp to resolve to 'IMAGE'");
  }
  if (getMediaTypeFromMime("video/mp4") !== "VIDEO") {
    throw new Error("Expected video/mp4 to resolve to 'VIDEO'");
  }
  if (getMediaTypeFromMime("video/quicktime") !== "VIDEO") {
    throw new Error("Expected video/quicktime to resolve to 'VIDEO'");
  }
  console.log("✅ getMediaTypeFromMime resolved correctly for all formats.");

  // 3. Verify Zod Validation Schema
  console.log("\n3. Testing createImageSchema Zod validation...");
  const validImagePayload = {
    imageUrl: "https://pwkubxblrpjjffvwufor.supabase.co/storage/v1/object/public/product-images/products/test/img1.avif",
    fileName: "showcase-fabric.avif",
    mimeType: "image/avif",
    storageKey: "products/test/img1.avif",
    mediaType: "IMAGE" as const,
  };
  const parsedImage = createImageSchema.parse(validImagePayload);
  if (parsedImage.mimeType !== "image/avif") {
    throw new Error("createImageSchema failed to parse valid AVIF image!");
  }

  const validVideoPayload = {
    imageUrl: "https://pwkubxblrpjjffvwufor.supabase.co/storage/v1/object/public/product-images/products/test/loop.mp4",
    fileName: "fabric-showcase-loop.mp4",
    mimeType: "video/mp4",
    storageKey: "products/test/loop.mp4",
    mediaType: "VIDEO" as const,
  };
  const parsedVideo = createImageSchema.parse(validVideoPayload);
  if (parsedVideo.mimeType !== "video/mp4") {
    throw new Error("createImageSchema failed to parse valid MP4 video!");
  }

  // Schema rejects invalid MIME
  let rejected = false;
  try {
    createImageSchema.parse({
      imageUrl: "https://example.com/doc.pdf",
      fileName: "invoice.pdf",
      mimeType: "application/pdf",
    });
  } catch {
    rejected = true;
  }
  if (!rejected) {
    throw new Error("createImageSchema should have rejected application/pdf!");
  }
  console.log("✅ createImageSchema successfully validated images, videos, and rejected non-media.");

  // 4. Verify Database & Service Layer with Supabase Public CDN URL
  console.log("\n4. Testing addProductImageService and deleteProductImageService...");
  const { db } = await import("@/db");
  const { productsTable } = await import("@/db/schema/catalog/products/table");
  const { categoriesTable } = await import("@/db/schema/catalog/categories/table");
  const { addProductImageService, deleteProductImageService, getProductImagesService } = await import("./services/product-image.service");
  const { eq } = await import("drizzle-orm");

  // Find or create test category and product
  const [cat] = await db.select().from(categoriesTable).limit(1);
  const testCategoryId = cat ? cat.id : null;

  const testProductRows = await db
    .insert(productsTable)
    .values({
      name: "Test Media Kurti",
      slug: `test-media-kurti-${Date.now()}`,
      storeId: "e98e4537-b11e-4f04-9c68-06dcfcfdd691",
      categoryId: testCategoryId || "0f666ca2-daa5-498f-9138-ef2349d3f762",
      status: "DRAFT",
    })
    .returning();
  const testProduct = testProductRows[0];

  try {
    const supabaseImageUrl = `https://pwkubxblrpjjffvwufor.supabase.co/storage/v1/object/public/${PRODUCT_MEDIA_BUCKET}/products/${testProduct.id}/test-image.webp`;
    const supabaseVideoUrl = `https://pwkubxblrpjjffvwufor.supabase.co/storage/v1/object/public/${PRODUCT_MEDIA_BUCKET}/products/${testProduct.id}/test-loop.mp4`;

    const addedImage = await addProductImageService({
      productId: testProduct.id,
      imageUrl: supabaseImageUrl,
      fileName: "test-image.webp",
      mimeType: "image/webp",
      storageKey: `products/${testProduct.id}/test-image.webp`,
      mediaType: "IMAGE",
    });

    if (!addedImage || !addedImage.id) {
      throw new Error("Failed to insert product image record!");
    }
    if (addedImage.imageUrl !== supabaseImageUrl) {
      throw new Error(`Expected image URL ${supabaseImageUrl}, got ${addedImage.imageUrl}`);
    }
    if (addedImage.mediaType !== "IMAGE") {
      throw new Error(`Expected mediaType 'IMAGE', got ${addedImage.mediaType}`);
    }

    const addedVideo = await addProductImageService({
      productId: testProduct.id,
      imageUrl: supabaseVideoUrl,
      fileName: "test-loop.mp4",
      mimeType: "video/mp4",
      storageKey: `products/${testProduct.id}/test-loop.mp4`,
      mediaType: "VIDEO",
    });

    if (!addedVideo || !addedVideo.id) {
      throw new Error("Failed to insert product video record!");
    }
    if (addedVideo.mediaType !== "VIDEO") {
      throw new Error(`Expected mediaType 'VIDEO', got ${addedVideo.mediaType}`);
    }

    // Verify retrieval
    const productMedia = await getProductImagesService(testProduct.id);
    if (productMedia.length !== 2) {
      throw new Error(`Expected 2 media items, got ${productMedia.length}`);
    }
    console.log(`✅ Database persisted Supabase storage URLs for both IMAGE and VIDEO.`);

    // Cleanup added media
    await deleteProductImageService(addedImage.id);
    await deleteProductImageService(addedVideo.id);
    const remainingMedia = await getProductImagesService(testProduct.id);
    if (remainingMedia.length !== 0) {
      throw new Error(`Expected 0 remaining media items, got ${remainingMedia.length}`);
    }
    console.log(`✅ deleteProductImageService cleaned up media assets.`);
  } finally {
    // Cleanup product
    await db.delete(productsTable).where(eq(productsTable.id, testProduct.id));
  }

  console.log("\n🎉 ALL PRODUCT MEDIA TESTS PASSED SUCCESSFULLY!");
  process.exit(0);
}

runMediaUploadTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
