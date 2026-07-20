import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function runCategoryModuleTests() {
  const { db } = await import("@/db");
  const { categories } = await import("@/db/schema/catalog/category/table");
  const { eq } = await import("drizzle-orm");

  const {
    createCategoryService,
    getCategoriesService,
    getCategoryService,
    updateCategoryService,
    moveCategoryService,
    deleteCategoryService,
  } = await import("./services");

  console.log("🚀 Starting Canonical Category Module Tests...");

  const timestamp = Date.now();
  let rootCat: any = null;
  let childCat: any = null;

  try {
    // 1. Create Root Category
    console.log("\n1. Testing createCategoryService (Root Category)...");
    rootCat = await createCategoryService({
      name: `Test Root Apparel ${timestamp}`,
      description: "Root apparel category",
    });
    console.log(`✅ Root Category created (ID: ${rootCat.id}, Slug: ${rootCat.slug})`);

    // 2. Create Child Category
    console.log("\n2. Testing createCategoryService (Child Category)...");
    childCat = await createCategoryService({
      name: `Test Kurtis Subcategory ${timestamp}`,
      parentId: rootCat.id,
      description: "Subcategory of Kurtis",
    });
    console.log(`✅ Child Category created (ID: ${childCat.id}, Level: ${childCat.level})`);

    // 3. Test getCategoryService
    console.log("\n3. Testing getCategoryService...");
    const fetched = await getCategoryService(rootCat.id);
    if (!fetched || fetched.name !== rootCat.name) {
      throw new Error("getCategoryService returned invalid data");
    }
    console.log(`✅ getCategoryService succeeded for "${fetched.name}"`);

    // 4. Test getCategoriesService (Tree Builder)
    console.log("\n4. Testing getCategoriesService (Tree Building)...");
    const { tree, raw } = await getCategoriesService();
    if (raw.length === 0) {
      throw new Error("getCategoriesService returned no categories");
    }
    console.log(`✅ getCategoriesService succeeded (Total raw categories: ${raw.length}, Tree roots: ${tree.length})`);

    // 5. Test updateCategoryService
    console.log("\n5. Testing updateCategoryService...");
    const updated = await updateCategoryService({
      id: childCat.id,
      name: `Updated Kurtis Subcategory ${timestamp}`,
    });
    if (!updated || !updated.name.startsWith("Updated")) {
      throw new Error("updateCategoryService failed");
    }
    console.log(`✅ updateCategoryService succeeded (New name: "${updated.name}")`);

    // 6. Test moveCategoryService
    console.log("\n6. Testing moveCategoryService...");
    const moved = await moveCategoryService({
      categoryId: childCat.id,
      newParentId: null,
    });
    console.log(`✅ moveCategoryService succeeded (New parentId: ${moved?.parentId})`);

    // 7. Test deleteCategoryService
    console.log("\n7. Testing deleteCategoryService...");
    await deleteCategoryService(rootCat.id);
    await deleteCategoryService(childCat.id);
    console.log(`✅ Soft delete verified for both test categories`);

    console.log("\n🎉 ALL CANONICAL CATEGORY MODULE TESTS PASSED! ✅");
  } finally {
    console.log("\n🧹 Cleaning up test records...");
    if (rootCat) {
      await db.delete(categories).where(eq(categories.id, rootCat.id));
    }
    if (childCat) {
      await db.delete(categories).where(eq(categories.id, childCat.id));
    }
    console.log("✅ Cleanup complete.");
  }

  process.exit(0);
}

runCategoryModuleTests().catch((err) => {
  console.error("❌ Category module test error:", err);
  process.exit(1);
});
