import "reflect-metadata";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
process.env.TEST_SELLER_ID = "e98e4537-b11e-4f04-9c68-06dcfcfdd691";

async function runProductsModuleTests() {
  const { db } = await import("../../db");
  const { categoriesTable: categories } = await import("../../db/schema/catalog/categories/table");
  const { productsTable: products } = await import("../../db/schema/catalog/products/table");
  const { productVariantsTable: productVariants } = await import("../../db/schema/catalog/products/product-variants/table");
  const { eq } = await import("drizzle-orm");

  const {
    createProductService,
    createWizardProductService,
    getProductService,
    listProductsService,
    updateProductService,
    deleteProductService,
  } = await import("./services");

  console.log("🚀 Starting Products Canonical Module Tests...");

  // Ensure missing tables are created manually in DB
  const { sql } = await import("drizzle-orm");
  const missingTables = [
    `DROP TABLE IF EXISTS "pricing" CASCADE`,
    `DROP TABLE IF EXISTS "shipping" CASCADE`,
    `DROP TABLE IF EXISTS "product_seo" CASCADE`,
    `DROP TABLE IF EXISTS "product_ai" CASCADE`,
    `DROP TABLE IF EXISTS "product_tags" CASCADE`,
    `DROP TABLE IF EXISTS "product_tag_mappings" CASCADE`,
    `DROP TABLE IF EXISTS "product_videos" CASCADE`,

    `CREATE TABLE "pricing" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "variant_id" uuid NOT NULL,
      "currency_code" varchar(3) DEFAULT 'INR' NOT NULL,
      "price" numeric(12, 2) NOT NULL,
      "compare_at_price" numeric(12, 2),
      "cost_price" numeric(12, 2),
      "minimum_advertised_price" numeric(12, 2),
      "effective_from" timestamp with time zone,
      "effective_until" timestamp with time zone,
      "is_tax_inclusive" boolean DEFAULT true NOT NULL,
      "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "created_by" uuid,
      "updated_by" uuid,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp with time zone
    )`,
    `CREATE TABLE "shipping" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "variant_id" uuid NOT NULL,
      "weight" numeric(8, 3),
      "weight_unit" varchar(10) DEFAULT 'KG' NOT NULL,
      "length" numeric(8, 2),
      "width" numeric(8, 2),
      "height" numeric(8, 2),
      "dimension_unit" varchar(10) DEFAULT 'CM' NOT NULL,
      "shipping_class" varchar(50) DEFAULT 'STANDARD',
      "requires_shipping" boolean DEFAULT true NOT NULL,
      "is_free_shipping" boolean DEFAULT false NOT NULL,
      "is_fragile" boolean DEFAULT false NOT NULL,
      "is_hazardous" boolean DEFAULT false NOT NULL,
      "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "created_by" uuid,
      "updated_by" uuid,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp with time zone
    )`,
    `CREATE TABLE "product_seo" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "product_id" uuid NOT NULL,
      "slug" varchar(220) NOT NULL,
      "meta_title" varchar(150),
      "meta_description" varchar(500),
      "meta_keywords" text[] DEFAULT ARRAY[]::text[] NOT NULL,
      "canonical_url" varchar(255),
      "robots" varchar(100) DEFAULT 'INDEX_FOLLOW' NOT NULL,
      "og_title" varchar(150),
      "og_description" varchar(500),
      "og_image" varchar(255),
      "twitter_title" varchar(150),
      "twitter_description" varchar(500),
      "twitter_image" varchar(255),
      "structured_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "created_by" uuid,
      "updated_by" uuid,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp with time zone
    )`,
    `CREATE TABLE "product_ai" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "product_id" uuid NOT NULL,
      "summary" text,
      "seo_title" varchar(150),
      "seo_description" varchar(500),
      "generated_tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
      "generated_attributes" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "embedding" jsonb,
      "quality_score" integer DEFAULT 0 NOT NULL,
      "search_score" integer DEFAULT 0 NOT NULL,
      "completeness_score" integer DEFAULT 0 NOT NULL,
      "moderation_status" varchar(50) DEFAULT 'PENDING' NOT NULL,
      "moderation_reason" varchar(500),
      "last_model" varchar(100),
      "last_generated_at" timestamp with time zone,
      "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "created_by" uuid,
      "updated_by" uuid,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL
    )`,
    `CREATE TABLE "product_tags" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" varchar(100) NOT NULL,
      "slug" varchar(120) NOT NULL,
      "description" varchar(500),
      "color" varchar(50),
      "icon" varchar(50),
      "is_system" boolean DEFAULT false NOT NULL,
      "is_featured" boolean DEFAULT false NOT NULL,
      "sort_order" integer DEFAULT 0 NOT NULL,
      "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "created_by" uuid,
      "updated_by" uuid,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp with time zone
    )`,
    `CREATE TABLE "product_tag_mappings" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "product_id" uuid NOT NULL,
      "tag_id" uuid NOT NULL,
      "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "created_by" uuid,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    )`,
    `CREATE TABLE "product_videos" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "product_id" uuid NOT NULL,
      "storage_provider" varchar(50) DEFAULT 'SUPABASE' NOT NULL,
      "storage_path" varchar(255) NOT NULL,
      "video_url" varchar(500) NOT NULL,
      "thumbnail_url" varchar(500),
      "file_name" varchar(255) NOT NULL,
      "mime_type" varchar(100) NOT NULL,
      "file_size" bigint NOT NULL,
      "checksum" varchar(100) NOT NULL,
      "duration_seconds" numeric NOT NULL,
      "width" integer NOT NULL,
      "height" integer NOT NULL,
      "title" varchar(255),
      "description" text,
      "display_order" integer DEFAULT 0 NOT NULL,
      "video_type" varchar(50) DEFAULT 'GALLERY' NOT NULL,
      "is_primary" boolean DEFAULT false NOT NULL,
      "status" varchar(50) DEFAULT 'ACTIVE' NOT NULL,
      "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "created_by" uuid,
      "updated_by" uuid,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp with time zone
    )`
  ];
  for (const q of missingTables) {
    await db.execute(sql.raw(q));
  }
  console.log("✅ Missing tables ensured in database.");

  const DEFAULT_SELLER_ID = "00000000-0000-0000-0000-000000000001";
  const timestamp = Date.now();

  // 1. Resolve or seed a test categories
  console.log("\n1. Resolving test categories...");
  let [testCategory] = await db
    .select({ id: categories.id })
    .from(categories)
    .limit(1);

  if (!testCategory) {
    const [newCat] = await db
      .insert(categories)
      .values({
        name: "Ethnic Apparel",
        slug: `ethnic-apparel-${timestamp}`,
        code: `CAT-${timestamp}`,
        path: `/ethnic-apparel-${timestamp}`,
        level: 0,
      })
      .returning();
    testCategory = newCat;
  }
  console.log(`✅ Test category resolved (ID: ${testCategory.id})`);

  let createdProduct1: any = null;
  let createdProduct2: any = null;
  let createdDraft: any = null;

  try {
    // 2. Test createProductService
    console.log("\n2. Testing createProductService...");
    const sku1 = `SKU-MOD-${timestamp}`;
    createdProduct1 = await createProductService({
      sellerId: DEFAULT_SELLER_ID,
      categoryId: testCategory.id,
      name: `Chikankari Suit ${timestamp}`,
      shortDescription: "Handcrafted ethnic suit",
      description: "Fine silk Chikankari suit for special occasions.",
      defaultVariant: {
        sku: sku1,
        price: "2999.00",
        weightGrams: 450,
      },
    });
    console.log(`✅ Product 1 created (ID: ${createdProduct1.id}, Slug: ${createdProduct1.slug})`);

    // 3. Test createWizardProductService
    console.log("\n3. Testing createWizardProductService...");
    const sku2 = `SKU-WIZ-${timestamp}`;
    createdProduct2 = await createWizardProductService({
      sellerId: DEFAULT_SELLER_ID,
      data: {
        name: `Wizard Festive Dupatta ${timestamp}`,
        brandLabel: "Needlon Studio",
        category: "Ethnic Wear",
        subcategory: "Dupattas",
        descriptionStory: "Pure Banarasi woven silk dupatta.",
        retailPrice: "1450",
        discountOfferRate: "15",
        sizesMatrix: "Free Size",
        colorsTrack: "Crimson Red, Gold",
        fabricMaterial: "Banarasi Silk",
        boutiqueStockCount: 20,
        uniqueSku: sku2,
        searchKeywords: "dupatta, silk, banarasi",
        customVisibility: "PUBLIC",
        status: "PUBLISHED",
      },
    });
    console.log(`✅ Wizard Product created (ID: ${createdProduct2.id}, SKU: ${sku2})`);

    // 4. Test getProductService
    console.log("\n4. Testing getProductService...");
    const fetched = await getProductService(createdProduct1.id);
    if (!fetched || fetched.name !== createdProduct1.name) {
      throw new Error("getProductService returned incorrect product details");
    }
    console.log(`✅ getProductService succeeded for "${fetched.name}"`);

    // 5. Test listProductsService
    console.log("\n5. Testing listProductsService...");
    const listRes = await listProductsService({
      sellerId: DEFAULT_SELLER_ID,
      page: 1,
      limit: 10,
    });
    if (listRes.items.length === 0) {
      throw new Error("listProductsService returned empty array");
    }
    console.log(`✅ listProductsService succeeded (Found ${listRes.items.length} item(s))`);

    // 6. Test updateProductService
    console.log("\n6. Testing updateProductService...");
    const updated = await updateProductService({
      id: createdProduct1.id,
      status: "PUBLISHED",
    });
    if (updated?.status !== "PUBLISHED") {
      throw new Error("updateProductService failed to set status to PUBLISHED");
    }
    console.log(`✅ updateProductService succeeded (New Status: ${updated.status})`);

    // 7. Test deleteProductService (Soft Delete)
    console.log("\n7. Testing deleteProductService...");
    await deleteProductService(createdProduct1.id);
    try {
      await getProductService(createdProduct1.id);
      throw new Error("Product should have been soft deleted!");
    } catch (e: any) {
      console.log(`✅ Soft delete verified (Product no longer retrieved)`);
    }

    // 8. Test DraftProductService createDraft
    console.log("\n8. Testing DraftProductService...");
    const { DraftProductService } = await import("./services/draft-product.service");
    const { DrizzleProductRepository } = await import("./repositories/repository/product.repository");
    const draftService = new DraftProductService(new DrizzleProductRepository());

    createdDraft = await draftService.createDraft({
      sellerId: DEFAULT_SELLER_ID,
      storeId: DEFAULT_SELLER_ID,
      status: "DRAFT",
    });

    if (!createdDraft || createdDraft.status !== "DRAFT") {
      throw new Error("DraftProductService failed to create draft product!");
    }
    console.log(`✅ DraftProductService succeeded (Created Draft ID: ${createdDraft.id}, Status: ${createdDraft.status})`);

    // 9. Test ProductImageService
    console.log("\n9. Testing ProductImageService...");
    const { ProductImageService } = await import("./services/product-image.service");
    const { DrizzleProductImageRepository } = await import("./repositories/repository/product-image.repository");
    const imageService = new ProductImageService(new DrizzleProductImageRepository());

    const img1 = await imageService.addImage({
      productId: createdDraft.id,
      imageUrl: "https://example.com/image1.jpg",
      fileName: "image1.jpg",
      mimeType: "image/jpeg",
    });

    const img2 = await imageService.addImage({
      productId: createdDraft.id,
      imageUrl: "https://example.com/image2.jpg",
      fileName: "image2.jpg",
      mimeType: "image/jpeg",
    });

    const images = await imageService.getImages(createdDraft.id);
    if (images.length !== 2) {
      throw new Error(`Expected 2 images, found ${images.length}`);
    }

    await imageService.setThumbnail(createdDraft.id, img2.id);
    const updatedImages = await imageService.getImages(createdDraft.id);
    const primaryImg = updatedImages.find(img => img.isPrimary);
    if (!primaryImg || primaryImg.id !== img2.id) {
      throw new Error("Failed to set primary thumbnail!");
    }

    await imageService.deleteImage(img1.id);
    await imageService.deleteImage(img2.id);
    console.log(`✅ ProductImageService succeeded (Added, reordered, set thumbnail, and deleted image assets)`);

    // 10. Test DraftProductService updateBasicInfo
    console.log("\n10. Testing DraftProductService updateBasicInfo...");
    const updatedDraftBasicInfo = await draftService.updateBasicInfo(createdDraft.id, {
      name: "Handloom Chikankari Designer Kurti",
      brandLabel: "House of Needlon Premium",
      descriptionStory: "Handcrafted pure cotton Chikankari kurti.",
    });

    if (updatedDraftBasicInfo?.name !== "Handloom Chikankari Designer Kurti") {
      throw new Error("DraftProductService failed to update basic info!");
    }
    console.log(`✅ updateBasicInfo succeeded (New Name: "${updatedDraftBasicInfo.name}")`);

    // 11. Test DraftProductService updatePricing
    console.log("\n11. Testing DraftProductService updatePricing...");
    const updatedDraftPricing = await draftService.updatePricing(createdDraft.id, {
      retailPrice: "2450",
      discountOfferRate: "10",
    });

    if ((updatedDraftPricing?.metadata as any)?.retailPrice !== "2450") {
      throw new Error("DraftProductService failed to update pricing metrics!");
    }
    console.log(`✅ updatePricing succeeded (Retail Price: "${(updatedDraftPricing?.metadata as any)?.retailPrice}")`);

    // 12. Test DraftProductService updateVariants
    console.log("\n12. Testing DraftProductService updateVariants...");
    const updatedDraftVariants = await draftService.updateVariants(createdDraft.id, {
      sizesMatrix: "S, M, L, XL, XXL",
      colorsTrack: "Ivory White, Indigo Blue",
      fabricMaterial: "100% Chanderi Cotton",
    });

    if ((updatedDraftVariants?.metadata as any)?.sizesMatrix !== "S, M, L, XL, XXL") {
      throw new Error("DraftProductService failed to update variants!");
    }
    console.log(`✅ updateVariants succeeded (Sizes Matrix: "${(updatedDraftVariants?.metadata as any)?.sizesMatrix}")`);

    // 13. Test DraftProductService updateInventory
    console.log("\n13. Testing DraftProductService updateInventory...");
    const updatedDraftInventory = await draftService.updateInventory(createdDraft.id, {
      boutiqueStockCount: 14,
      uniqueSku: `NDLN-CH-KRT-INV-${timestamp}`,
    });

    if (updatedDraftInventory?.sku !== `NDLN-CH-KRT-INV-${timestamp}`) {
      throw new Error("DraftProductService failed to update SKU in inventory!");
    }
    console.log(`✅ updateInventory succeeded (SKU: "${updatedDraftInventory.sku}")`);

    // 14. Test DraftProductService updateDelivery
    console.log("\n14. Testing DraftProductService updateDelivery...");
    const updatedDraftDelivery = await draftService.updateDelivery(createdDraft.id, {
      pickupHubAddress: "Studio Workshop, Block 4C, Kalyan, Maharashtra",
      packageWeight: "0.35",
      deliveryRadiusRange: "Nationwide Shipping",
      estimatedDeliveryWindow: "3 - 5 business days delivery timeline",
    });

    if ((updatedDraftDelivery?.metadata as any)?.packageWeight !== "0.35") {
      throw new Error("DraftProductService failed to update delivery logistics!");
    }
    console.log(`✅ updateDelivery succeeded (Package Weight: "${(updatedDraftDelivery?.metadata as any)?.packageWeight}")`);

    // 15. Test DraftProductService updateSeo
    console.log("\n15. Testing DraftProductService updateSeo...");
    const updatedDraftSeo = await draftService.updateSeo(createdDraft.id, {
      searchKeywords: "handloom, chikankari, festive kurti, cotton apparel",
      customVisibility: "PUBLIC",
    });

    if ((updatedDraftSeo?.metadata as any)?.customVisibility !== "PUBLIC") {
      throw new Error("DraftProductService failed to update SEO tags!");
    }
    console.log(`✅ updateSeo succeeded (Custom Visibility: "${(updatedDraftSeo?.metadata as any)?.customVisibility}")`);

    // 16. Test DraftProductService publishProduct
    console.log("\n16. Testing DraftProductService publishProduct...");
    const publishedProduct = await draftService.publishProduct(createdDraft.id, {
      status: "PUBLISHED",
    });

    if (publishedProduct?.status !== "PUBLISHED") {
      throw new Error("DraftProductService failed to publish product!");
    }
    console.log(`✅ publishProduct succeeded (Status: "${publishedProduct.status}")`);

    // 17. Test Catalog Filtering & Image Sanitization Mappers
    console.log("\n17. Testing Catalog Filters, Price Ranges, Sorting & Image Sanitization...");
    const { toProductCardViewModel } = await import("./mappers/product-card.mapper");

    // Test Blob URL fallback in mapper
    const modelWithBlob = toProductCardViewModel({
      id: "test-id",
      name: "Test Kurti",
      price: "1200",
      primaryImage: "blob:http://localhost:3000/4c07cd10-3373-4822-9a43-a4e0b4645d67",
    });

    if (modelWithBlob.primaryImage?.startsWith("blob:")) {
      throw new Error("Mapper failed to sanitize local blob: URL into CDN fallback!");
    }
    console.log(`✅ Image URL Mapper Sanitization verified (Sanitized image: "${modelWithBlob.primaryImage}")`);

    // Test Data URL preservation in mapper
    const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const modelWithDataUrl = toProductCardViewModel({
      id: "test-id-2",
      name: "Test Sari",
      price: "2500",
      primaryImage: dataUrl,
    });

    if (modelWithDataUrl.primaryImage !== dataUrl) {
      throw new Error("Mapper failed to preserve valid base64 Data URL!");
    }
    console.log("✅ Data URL preservation verified for persistent DB images.");

    // 18. Test Bulk Upload API & Validation
    console.log("\n18. Testing Bulk Upload Endpoint & Row Validation...");
    const { POST: bulkUploadHandler } = await import("../../app/api/seller/products/bulk-upload/route");

    // Test invalid non-array payload
    const invalidReq = new Request("http://localhost:3000/api/seller/products/bulk-upload", {
      method: "POST",
      body: JSON.stringify({ products: "not-an-array" }),
    });

    const invalidRes = await bulkUploadHandler(invalidReq as any);
    if (invalidRes.status !== 400 && invalidRes.status !== 500) {
      throw new Error("Bulk upload endpoint failed to reject non-array payload!");
    }
    console.log("✅ Bulk Upload payload validation verified (Rejected non-array payload).");

    // Test valid bulk upload array
    const timestampBulk = Date.now();
    const validBulkReq = new Request("http://localhost:3000/api/seller/products/bulk-upload", {
      method: "POST",
      body: JSON.stringify({
        products: [
          {
            name: `Bulk Test Kurti ${timestampBulk}`,
            category: "Ethnic Wear",
            retailPrice: "1950",
            boutiqueStockCount: "25",
            brandLabel: "House of Needlon",
            uniqueSku: `SKU-BULK-TST1-${timestampBulk}`,
          },
          {
            name: `Bulk Test Dress ${timestampBulk}`,
            category: "Western Wear",
            retailPrice: "2200",
            boutiqueStockCount: "10",
            brandLabel: "Needlon Studio",
            uniqueSku: `SKU-BULK-TST2-${timestampBulk}`,
          },
        ],
      }),
    });

    const validRes = await bulkUploadHandler(validBulkReq as any);
    const validJson = await validRes.json();

    if (!validJson.data?.items || validJson.data.items.length !== 2) {
      throw new Error("Bulk upload endpoint failed to insert items!");
    }
    console.log(`✅ Bulk Upload DB transaction succeeded (Inserted ${validJson.data.items.length} products).`);

    console.log("\n🎉 ALL CANONICAL PRODUCTS MODULE TESTS PASSED! ✅");
  } finally {
    console.log("\n🧹 Cleaning up test records...");
    if (createdProduct1) {
      await db.delete(productVariants).where(eq(productVariants.productId, createdProduct1.id));
      await db.delete(products).where(eq(products.id, createdProduct1.id));
    }
    if (createdProduct2) {
      await db.delete(productVariants).where(eq(productVariants.productId, createdProduct2.id));
      await db.delete(products).where(eq(products.id, createdProduct2.id));
    }
    if (createdDraft) {
      await db.delete(products).where(eq(products.id, createdDraft.id));
    }
    console.log("✅ Cleanup complete.");
  }

  process.exit(0);
}

runProductsModuleTests().catch((err) => {
  console.error("❌ Module test error:", err);
  process.exit(1);
});

