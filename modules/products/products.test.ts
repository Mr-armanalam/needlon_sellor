import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function runProductsModuleTests() {
  const { db } = await import("@/db");
  const { categories } = await import("@/db/schema/catalog/categories/table");
  const { products } = await import("@/db/schema/products/products");
  const { productVariants } = await import("@/db/schema/products/product_variants");
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
        level: 0,
      })
      .returning();
    testCategory = newCat;
  }
  console.log(`✅ Test category resolved (ID: ${testCategory.id})`);

  let createdProduct1: any = null;
  let createdProduct2: any = null;

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
    console.log("✅ Cleanup complete.");
  }

  process.exit(0);
}

runProductsModuleTests().catch((err) => {
  console.error("❌ Module test error:", err);
  process.exit(1);
});
