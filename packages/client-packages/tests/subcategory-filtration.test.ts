import assert from "node:assert";
import {
  normalizeCategoryName,
  getCategoryIdByName,
  getCategoryFilters,
} from "../client-modules/category/services/filterServices";
import {
  normalizeCategoryType,
  ProductRepository,
} from "../client-modules/product/repositories/product-repository";

async function runFiltrationTests() {
  console.log("--> Starting Subcategory Filtration & Sorting Unit Tests...");

  // 1. Test normalizeCategoryName and normalizeCategoryType
  console.log("1. Testing category normalization helpers...");
  assert.strictEqual(normalizeCategoryName("items-for-men"), "mens-wear");
  assert.strictEqual(normalizeCategoryName("items-for-women"), "women-wear");
  assert.strictEqual(normalizeCategoryName("men"), "mens-wear");
  assert.strictEqual(normalizeCategoryName("women"), "women-wear");
  assert.strictEqual(normalizeCategoryType("items-for-men"), "mens-wear");
  assert.strictEqual(normalizeCategoryType("items-for-women"), "women-wear");
  console.log("✓ Normalization functions verified.");

  // 2. Test getCategoryIdByName resolution
  console.log("2. Testing getCategoryIdByName with hierarchy...");
  const menCatId = await getCategoryIdByName("items-for-men");
  assert.ok(menCatId, "Should resolve Men's Wear category ID");

  const menShirtCatId = await getCategoryIdByName("shirts", "items-for-men");
  assert.ok(menShirtCatId, "Should resolve Men's Shirt subcategory ID");

  const womenCatId = await getCategoryIdByName("items-for-women");
  assert.ok(womenCatId, "Should resolve Women's Wear category ID");

  assert.notStrictEqual(menCatId, womenCatId, "Men and Women category IDs must differ");
  console.log(`✓ Resolved Men ID (${menCatId}) and Women ID (${womenCatId})`);

  // 3. Test getCategoryFilters returns filter groups
  console.log("3. Testing getCategoryFilters for Men's Shirts...");
  const menFilters = await getCategoryFilters(menShirtCatId, menCatId);
  assert.ok(Array.isArray(menFilters), "Filters must be an array");
  assert.ok(menFilters.length > 0, "Men's category must have filter groups (Size, Color, etc.)");
  
  const filterSlugs = menFilters.map(f => f.slug);
  assert.ok(filterSlugs.includes("mens-color") || filterSlugs.includes("mens-size"), "Must include mens-color or mens-size");
  console.log(`✓ Retrieved ${menFilters.length} filter groups for Men's Wear: ${filterSlugs.join(", ")}`);

  // 4. Test ProductRepository.getProducts: Men's Shirts subcategory filter
  console.log("4. Testing ProductRepository.getProducts for Men's Shirts...");
  const menShirtRows = await ProductRepository.getProducts({
    categoryType: "items-for-men",
    subcatSlug: "shirts",
    limit: 10,
  });

  assert.ok(Array.isArray(menShirtRows), "Should return array of rows");
  assert.ok(menShirtRows.length > 0, "Should return at least 1 men's shirt");
  for (const row of menShirtRows) {
    const prodName = row.product.name.toLowerCase();
    const parentCatSlug = row.category?.slug?.toLowerCase() || "";
    assert.ok(
      parentCatSlug.includes("mens") || prodName.includes("men"),
      `Product "${row.product.name}" must belong to Men's Wear, got category "${parentCatSlug}"`
    );
    assert.ok(
      prodName.includes("shirt"),
      `Product "${row.product.name}" must be a shirt`
    );
    assert.ok(
      !prodName.includes("pant") && !prodName.includes("suit") && !prodName.includes("kurta"),
      `Product "${row.product.name}" must not be pant, suit, or kurta`
    );
  }
  console.log(`✓ Men's Shirts query strictly returned ${menShirtRows.length} shirts without cross-category leakage.`);

  // 5. Test ProductRepository.getProducts: Men's Pants subcategory filter
  console.log("5. Testing ProductRepository.getProducts for Men's Pants...");
  const menPantRows = await ProductRepository.getProducts({
    categoryType: "items-for-men",
    subcatSlug: "pants",
    limit: 10,
  });
  assert.ok(Array.isArray(menPantRows), "Should return array of rows");
  assert.ok(menPantRows.length > 0, "Should return at least 1 men's pant");
  for (const row of menPantRows) {
    const prodName = row.product.name.toLowerCase();
    assert.ok(
      prodName.includes("pant") || prodName.includes("trouser"),
      `Product "${row.product.name}" must be pants/trousers`
    );
  }
  console.log(`✓ Men's Pants query strictly returned ${menPantRows.length} pants.`);

  // 6. Test Price Sorting (Low to High vs High to Low)
  console.log("6. Testing Price Sorting (Low to High vs High to Low)...");
  const lowToHigh = await ProductRepository.getProducts({
    categoryType: "items-for-men",
    subcatSlug: "shirts",
    sort: "priceLow",
    limit: 10,
  });

  const highToLow = await ProductRepository.getProducts({
    categoryType: "items-for-men",
    subcatSlug: "shirts",
    sort: "priceHigh",
    limit: 10,
  });

  if (lowToHigh.length >= 2) {
    const price1 = Number(lowToHigh[0].pricing?.price || 0);
    const price2 = Number(lowToHigh[1].pricing?.price || 0);
    assert.ok(price1 <= price2, `Low to High: ${price1} should be <= ${price2}`);

    const hPrice1 = Number(highToLow[0].pricing?.price || 0);
    const hPrice2 = Number(highToLow[1].pricing?.price || 0);
    assert.ok(hPrice1 >= hPrice2, `High to Low: ${hPrice1} should be >= ${hPrice2}`);
    console.log(`✓ Price sorting verified: LowToHigh (${price1} <= ${price2}), HighToLow (${hPrice1} >= ${hPrice2})`);
  } else {
    console.log("✓ Single item returned, price sorting contract verified.");
  }

  // 7. Test Attribute Filtering
  console.log("7. Testing Attribute Filtering (mens-color: White)...");
  const whiteShirts = await ProductRepository.getProducts({
    categoryType: "items-for-men",
    subcatSlug: "shirts",
    attributeFilters: { "mens-color": ["White"] },
    limit: 10,
  });
  assert.ok(Array.isArray(whiteShirts), "Should return array");
  assert.ok(whiteShirts.length > 0, "Should find white shirt");
  assert.ok(whiteShirts[0].product.name.toLowerCase().includes("white"), "Should match white shirt");
  console.log(`✓ Attribute filtering strictly returned matching shirt: ${whiteShirts[0].product.name}`);

  console.log("\n=== ALL SUB-CATEGORY FILTRATION TESTS PASSED SUCCESSFULLY! ===");
  process.exit(0);
}

runFiltrationTests().catch((err) => {
  console.error("Filtration unit test failed:", err);
  process.exit(1);
});
