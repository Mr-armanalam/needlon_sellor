import assert from "node:assert";
import crypto from "node:crypto";
import { db } from "../../db/db";
import { categoriesTable } from "../../db/db/schema/catalog/categories/table";
import { productsTable } from "../../db/db/schema/catalog/products/table";
import { productVariantsTable } from "../../db/db/schema/catalog/products/product-variants/table";
import { pricingTable } from "../../db/db/schema/catalog/products/pricing/table";
import { inventoryTable } from "../../db/db/schema/catalog/products/inventory/table";
import { productImagesTable } from "../../db/db/schema/catalog/products/product-images/table";
import { eq } from "drizzle-orm";
import { ProductRepository } from "../client-modules/product/repositories/product-repository";
import {
  transformDbProductToDto,
  transformToProductCard,
} from "../client-modules/product/services/product-transformer";
import {
  getCategoryIdByName,
  getCategoryFilters,
} from "../client-modules/category/services/filterServices";

async function runPhase3Tests() {
  console.log("--> Running Phase 3 Tests: Catalog, Products & Faceted Filtering (Live DB)...");

  const testSuffix = Date.now();
  const testCatId = crypto.randomUUID();
  const testProdId = crypto.randomUUID();
  const testVariantId = crypto.randomUUID();
  const testMediaId = crypto.randomUUID();

  console.log("1. Setting up temporary catalog test records...");
  // 1. Insert test category
  const [createdCat] = await db
    .insert(categoriesTable)
    .values({
      id: testCatId,
      name: `Test Men Collection ${testSuffix}`,
      slug: `test-men-collection-${testSuffix}`,
      code: `CAT-TEST-${testSuffix}`,
      path: `test-men-${testSuffix}`,
      level: 0,
      isLeaf: true,
      description: "Test apparel category for phase 3 verification.",
    })
    .returning();

  assert.ok(createdCat, "Category should be inserted");
  console.log(`✓ Test category created: ${createdCat.name}`);

  // 2. Insert test product
  const [createdProd] = await db
    .insert(productsTable)
    .values({
      id: testProdId,
      categoryId: testCatId,
      name: `Luxury Cashmere Knit ${testSuffix}`,
      slug: `luxury-cashmere-knit-${testSuffix}`,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      productType: "PHYSICAL",
      isFeatured: true,
      description: "Premium handcrafted cashmere knitwear.",
    })
    .returning();

  assert.ok(createdProd, "Product should be inserted");
  console.log(`✓ Test product created: ${createdProd.name}`);

  // 3. Insert test variant, pricing, and inventory
  const [createdVariant] = await db
    .insert(productVariantsTable)
    .values({
      id: testVariantId,
      productId: testProdId,
      name: "Size L",
      sku: `SKU-CASH-${testSuffix}`,
      status: "ACTIVE",
    })
    .returning();

  await db.insert(pricingTable).values({
    variantId: testVariantId,
    price: "4999.00",
    compareAtPrice: "6999.00",
    currencyCode: "INR",
  });

  await db.insert(inventoryTable).values({
    variantId: testVariantId,
    quantity: 40,
    reservedQuantity: 2,
  });

  await db.insert(productImagesTable).values({
    id: testMediaId,
    productId: testProdId,
    mediaType: "IMAGE",
    imageUrl: "https://images.unsplash.com/photo-test.jpg",
    isPrimary: true,
    displayOrder: 1,
  });

  console.log("✓ Test variant, pricing, inventory, and media linked.");

  try {
    // 4. Test ProductRepository.getProductById
    console.log("4. Testing ProductRepository.getProductById...");
    const prodRecord = await ProductRepository.getProductById(testProdId);
    assert.ok(prodRecord, "Product record should be returned");
    assert.strictEqual(prodRecord.product.name, createdProd.name);
    assert.strictEqual(prodRecord.category?.id, testCatId);
    console.log("✓ Live getProductById verified.");

    // 5. Test ProductRepository.getProductImages
    console.log("5. Testing ProductRepository.getProductImages...");
    const images = await ProductRepository.getProductImages(testProdId);
    assert.ok(Array.isArray(images), "Images should be an array");
    assert.strictEqual(images.length, 1);
    assert.strictEqual(images[0].imageUrl, "https://images.unsplash.com/photo-test.jpg");
    console.log("✓ Live getProductImages verified.");

    // 6. Test ProductRepository.getProductVariants
    console.log("6. Testing ProductRepository.getProductVariants...");
    const variants = await ProductRepository.getProductVariants(testProdId);
    assert.ok(Array.isArray(variants), "Variants should be an array");
    assert.strictEqual(variants.length, 1);
    assert.strictEqual(variants[0].variant?.name, "Size L");
    assert.strictEqual(Number(variants[0].pricing?.price), 4999);
    assert.strictEqual(variants[0].inventory?.quantity, 40);
    console.log("✓ Live getProductVariants verified.");

    // 7. Test DTO transformation
    console.log("7. Testing transformDbProductToDto and transformToProductCard...");
    const dto = transformDbProductToDto(prodRecord, images, variants);
    assert.ok(dto.product, "DTO product should exist");
    assert.strictEqual(dto.product.id, testProdId);
    assert.strictEqual(dto.product.price, 4999);
    assert.strictEqual(dto.product.mrp_price, 6999);
    assert.strictEqual(dto.product.image, "https://images.unsplash.com/photo-test.jpg");
    assert.ok(dto.product.sizes.includes("Size L"));
    assert.strictEqual(dto.Category.categoryName, createdCat.name);

    const card = transformToProductCard(dto);
    assert.strictEqual(card.id, testProdId);
    assert.strictEqual(card.price, 4999);
    assert.strictEqual(card.name, createdProd.name);
    console.log("✓ DTO transformation contract verified.");

    // 8. Test ProductRepository.getProducts
    console.log("8. Testing ProductRepository.getProducts...");
    const rows = await ProductRepository.getProducts({
      categorySlug: createdCat.slug,
      limit: 10,
    });
    assert.ok(Array.isArray(rows), "Should return array of rows");
    assert.ok(rows.length >= 1, "Should find at least 1 product");
    console.log(`✓ Live getProducts returned ${rows.length} rows.`);

    // 9. Test getCategoryIdByName
    console.log("9. Testing getCategoryIdByName...");
    const foundCatId = await getCategoryIdByName(createdCat.slug);
    assert.strictEqual(foundCatId, testCatId);
    console.log("✓ getCategoryIdByName verified.");

    // 10. Test getCategoryFilters
    console.log("10. Testing getCategoryFilters...");
    const filters = await getCategoryFilters(testCatId);
    assert.ok(Array.isArray(filters), "Filters should return an array");
    console.log(`✓ getCategoryFilters returned ${filters.length} filter groups.`);

  } finally {
    // Clean up temporary catalog records
    console.log("11. Cleaning up test records...");
    await db.delete(pricingTable).where(eq(pricingTable.variantId, testVariantId));
    await db.delete(inventoryTable).where(eq(inventoryTable.variantId, testVariantId));
    await db.delete(productVariantsTable).where(eq(productVariantsTable.id, testVariantId));
    await db.delete(productImagesTable).where(eq(productImagesTable.id, testMediaId));
    await db.delete(productsTable).where(eq(productsTable.id, testProdId));
    await db.delete(categoriesTable).where(eq(categoriesTable.id, testCatId));
    console.log("✓ Cleanup finished.");
  }

  console.log("=== All Phase 3 Catalog Tests Passed Successfully! ===");
  process.exit(0);
}

runPhase3Tests().catch((err) => {
  console.error("Phase 3 test failed:", err);
  process.exit(1);
});
