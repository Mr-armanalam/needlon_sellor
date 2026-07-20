import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function runProductTests() {
  const { db } = await import("@/db");
  const { categories } = await import("@/db/schema/catalog/category/table");
  const { products } = await import("@/db/schema/products/products");
  const { productVariants } = await import("@/db/schema/products/product_variants");
  const { eq, isNull, sql } = await import("drizzle-orm");

  const {
    createProductService,
    updateProductService,
    getProductService,
    listProductsService,
    deleteProductService,
    createVariantService,
  } = await import("./services");

  console.log("🚀 Starting Catalog Product Repository & Service Tests...");

  const testSellerId = "00000000-0000-0000-0000-000000000001";
  const timestamp = Date.now();
  const testCatCode = `TCAT_${timestamp}`;
  const testCatSlug = `test-category-${timestamp}`;

  // 1. Resolve a test category to satisfy FK constraint
  console.log("\n1. Resolving test category...");
  const catRows = await db.execute(sql`SELECT id FROM categories LIMIT 1`);
  let testCatId = (catRows[0] as any)?.id;

  if (!testCatId) {
    const insertedCat = await db.execute(
      sql`INSERT INTO categories (name, slug, level) VALUES ('Test Category', ${testCatSlug}, 0) RETURNING id`
    );
    testCatId = (insertedCat[0] as any)?.id;
  }

  if (!testCatId) {
    console.error("❌ Failed to resolve test category ID");
    process.exit(1);
  }
  console.log(`✅ Test category resolved (ID: ${testCatId})`);

  let createdProductId: string | null = null;
  let createdVariantId: string | null = null;

  try {
    // 2. Test createProductService with default variant
    console.log("\n2. Testing createProductService...");
    const testSku = `SKU-TEST-${timestamp}`;
    const productResult = await createProductService({
      sellerId: testSellerId,
      categoryId: testCatId,
      name: `Awesome Product ${timestamp}`,
      shortDescription: "A great test product",
      description: "Detailed description of awesome test product.",
      defaultVariant: {
        sku: testSku,
        price: "99.99",
        compareAtPrice: "120.00",
        costPrice: "50.00",
        weightGrams: 500,
      },
    });

    createdProductId = productResult.id;
    if (productResult.defaultVariant) {
      createdVariantId = productResult.defaultVariant.id;
    }

    console.log(`✅ Product created (ID: ${productResult.id}, Slug: ${productResult.slug})`);
    if (productResult.defaultVariant) {
      console.log(`✅ Default Variant created (SKU: ${productResult.defaultVariant.sku})`);
    }

    if (!productResult.slug.startsWith("awesome-product")) {
      console.error(`❌ Unexpected slug format: ${productResult.slug}`);
      process.exit(1);
    }

    // 3. Test getProductService
    console.log("\n3. Testing getProductService...");
    const fetchedProduct = await getProductService(createdProductId);
    if (!fetchedProduct || fetchedProduct.id !== createdProductId) {
      console.error("❌ getProductService failed to fetch created product");
      process.exit(1);
    }
    console.log(`✅ getProductService succeeded (Name: "${fetchedProduct.name}")`);

    // 4. Test listProductsService
    console.log("\n4. Testing listProductsService...");
    const listResult = await listProductsService({
      sellerId: testSellerId,
      page: 1,
      limit: 10,
    });
    if (listResult.pagination.total === 0) {
      console.error("❌ listProductsService returned 0 products");
      process.exit(1);
    }
    console.log(`✅ listProductsService succeeded (Found ${listResult.pagination.total} product(s))`);

    // 5. Test createVariantService & SKU duplicate rejection
    console.log("\n5. Testing createVariantService & SKU duplicate check...");
    const secondSku = `SKU-TEST-2-${timestamp}`;
    const extraVariant = await createVariantService({
      productId: createdProductId,
      sku: secondSku,
      price: "149.99",
    });
    console.log(`✅ Additional variant created (SKU: ${extraVariant.sku})`);

    // Test duplicate SKU failure
    let duplicateFailed = false;
    try {
      await createVariantService({
        productId: createdProductId,
        sku: testSku,
        price: "10.00",
      });
    } catch (err: any) {
      duplicateFailed = true;
      console.log(`✅ Duplicate SKU correctly rejected: ${err.message}`);
    }
    if (!duplicateFailed) {
      console.error("❌ Duplicate SKU was NOT rejected!");
      process.exit(1);
    }

    // 6. Test updateProductService
    console.log("\n6. Testing updateProductService...");
    const updatedProduct = await updateProductService({
      id: createdProductId,
      name: `Awesome Product Updated ${timestamp}`,
      status: "PUBLISHED",
    });
    if (!updatedProduct || updatedProduct.status !== "PUBLISHED") {
      console.error("❌ updateProductService failed to update status to PUBLISHED");
      process.exit(1);
    }
    console.log(`✅ updateProductService succeeded (New Slug: ${updatedProduct.slug}, Status: ${updatedProduct.status})`);

    // 7. Test deleteProductService
    console.log("\n7. Testing deleteProductService (Soft Delete)...");
    await deleteProductService(createdProductId);
    
    let isDeleted = false;
    try {
      await getProductService(createdProductId);
    } catch {
      isDeleted = true;
    }

    if (!isDeleted) {
      console.error("❌ Product was still retrievable after soft delete!");
      process.exit(1);
    }
    console.log("✅ Soft delete verified (Product no longer retrieved by getProductService)");

    console.log("\n🎉 ALL PRODUCT REPOSITORY & SERVICE TESTS PASSED SUCCESSFULLY! ✅");
  } finally {
    // Cleanup database records
    console.log("\n🧹 Cleaning up test records from database...");
    if (createdProductId) {
      await db.delete(productVariants).where(eq(productVariants.productId, createdProductId));
      await db.delete(products).where(eq(products.id, createdProductId));
    }
    await db.execute(sql`DELETE FROM categories WHERE slug = ${testCatSlug}`);
    console.log("✅ Cleanup complete.");
  }

  process.exit(0);
}

runProductTests().catch((err) => {
  console.error("❌ Product test execution failed:", err);
  process.exit(1);
});
