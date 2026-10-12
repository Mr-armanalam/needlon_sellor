import { db } from "@needlon/db";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { productVariantsTable } from "@needlon/db/db/schema/catalog/products/product-variants/table";
import { pricingTable } from "@needlon/db/db/schema/catalog/products/pricing/table";
import { inventoryTable } from "@needlon/db/db/schema/catalog/products/inventory/table";
import { productImagesTable } from "@needlon/db/db/schema/catalog/products/product-images/table";
import { categoriesTable } from "@needlon/db/db/schema/catalog/categories/table";
import { categoryAttributesTable } from "@needlon/db/db/schema/catalog/category-attributes";
import { categoryAttributeOptionsTable } from "@needlon/db/db/schema/catalog/category-attribute-options";
import { productAttributeValuesTable } from "@needlon/db/db/schema/catalog/products/product-attribute-values/table";
import { eq, and, desc, asc, sql, ilike, or, isNull, aliasedTable } from "drizzle-orm";

export interface QueryProductsParams {
  categorySlug?: string;
  categoryType?: string;
  subcatSlug?: string;
  limit?: number;
  offset?: number;
  sort?: "price-asc" | "price-desc" | "newest" | "popular" | "priceLow" | "priceHigh" | "featured";
  isFeatured?: boolean;
  attributeFilters?: Record<string, string[]>;
}

export function normalizeCategoryType(cat?: string): string {
  if (!cat) return "";
  const lower = cat.toLowerCase().trim();
  if (lower === "items-for-men" || lower === "men" || lower === "mens") return "mens-wear";
  if (lower === "items-for-women" || lower === "women" || lower === "womens") return "women-wear";
  return lower;
}

export const ProductRepository = {
  async getProducts(params: QueryProductsParams = {}) {
    if (!process.env.DATABASE_URL) return [];

    try {
      const {
        limit = 30,
        offset = 0,
        sort = "featured",
        categorySlug,
        categoryType,
        subcatSlug,
        isFeatured,
        attributeFilters,
      } = params;

      const parentCategoryTable = aliasedTable(categoriesTable, "parent_cat");
      const subCategoryTable = aliasedTable(categoriesTable, "sub_cat");

      const conditions: any[] = [
        eq(productsTable.status, "PUBLISHED"),
        eq(productsTable.visibility, "PUBLIC"),
      ];

      if (isFeatured !== undefined) {
        conditions.push(eq(productsTable.isFeatured, isFeatured));
      }

      // 1. Parent Category filter (e.g. items-for-men -> mens-wear)
      if (categoryType) {
        const normalizedType = normalizeCategoryType(categoryType);
        conditions.push(
          or(
            ilike(parentCategoryTable.slug, `%${normalizedType}%`),
            ilike(parentCategoryTable.name, `%${normalizedType}%`)
          )
        );
      }

      // 2. Subcategory filter (e.g. shirts -> mens-wear-shirt, pants -> mens-wear-pants)
      if (subcatSlug) {
        const subSlugLower = subcatSlug.toLowerCase().trim();
        const subClean = subSlugLower.replace(/s$/, "");

        let subCondition: any;
        if (subSlugLower === "shirts" || subSlugLower === "shirt") {
          subCondition = or(
            ilike(subCategoryTable.slug, "%shirt%"),
            ilike(subCategoryTable.name, "%shirt%"),
            and(isNull(productsTable.subcategoryId), ilike(productsTable.name, "%shirt%"))
          );
        } else if (subSlugLower === "pants" || subSlugLower === "pant" || subSlugLower === "trousers") {
          subCondition = or(
            ilike(subCategoryTable.slug, "%pant%"),
            ilike(subCategoryTable.slug, "%trouser%"),
            ilike(subCategoryTable.name, "%pant%"),
            ilike(subCategoryTable.name, "%trouser%"),
            and(isNull(productsTable.subcategoryId), or(ilike(productsTable.name, "%pant%"), ilike(productsTable.name, "%trouser%")))
          );
        } else if (subSlugLower === "outerwears" || subSlugLower === "outerwear" || subSlugLower === "coat" || subSlugLower === "jackets") {
          subCondition = or(
            ilike(subCategoryTable.slug, "%coat%"),
            ilike(subCategoryTable.slug, "%jacket%"),
            ilike(subCategoryTable.slug, "%sapari%"),
            ilike(subCategoryTable.slug, "%blazer%"),
            ilike(subCategoryTable.name, "%coat%"),
            ilike(subCategoryTable.name, "%jacket%"),
            and(isNull(productsTable.subcategoryId), or(ilike(productsTable.name, "%coat%"), ilike(productsTable.name, "%jacket%"), ilike(productsTable.name, "%sapari%"), ilike(productsTable.name, "%blazer%")))
          );
        } else if (subSlugLower === "kurtas" || subSlugLower === "kurta") {
          subCondition = or(
            ilike(subCategoryTable.slug, "%kurta%"),
            ilike(subCategoryTable.slug, "%sherwani%"),
            ilike(subCategoryTable.name, "%kurta%"),
            ilike(subCategoryTable.name, "%sherwani%"),
            and(isNull(productsTable.subcategoryId), or(ilike(productsTable.name, "%kurta%"), ilike(productsTable.name, "%sherwani%")))
          );
        } else if (subSlugLower === "suits" || subSlugLower === "suit") {
          subCondition = or(
            ilike(subCategoryTable.slug, "%suit%"),
            ilike(subCategoryTable.name, "%suit%"),
            and(isNull(productsTable.subcategoryId), ilike(productsTable.name, "%suit%"))
          );
        } else if (subSlugLower === "lahengas" || subSlugLower === "lehangas" || subSlugLower === "lehanga") {
          subCondition = or(
            ilike(subCategoryTable.slug, "%lehanga%"),
            ilike(subCategoryTable.slug, "%blouse%"),
            ilike(subCategoryTable.slug, "%skirt%"),
            ilike(subCategoryTable.name, "%lehanga%"),
            ilike(subCategoryTable.name, "%blouse%")
          );
        } else if (subSlugLower === "formal") {
          subCondition = or(
            ilike(subCategoryTable.slug, "%shirt%"),
            ilike(subCategoryTable.slug, "%pant%"),
            ilike(subCategoryTable.slug, "%formal%"),
            ilike(productsTable.name, "%formal%"),
            ilike(productsTable.name, "%shirt%"),
            ilike(productsTable.name, "%pant%")
          );
        } else {
          subCondition = or(
            ilike(subCategoryTable.slug, `%${subClean}%`),
            ilike(subCategoryTable.name, `%${subClean}%`),
            ilike(subCategoryTable.slug, `%${subSlugLower}%`),
            ilike(subCategoryTable.name, `%${subSlugLower}%`),
            and(isNull(productsTable.subcategoryId), ilike(productsTable.name, `%${subClean}%`))
          );
        }
        conditions.push(subCondition);
      }

      // 3. Fallback categorySlug (if neither categoryType nor subcatSlug was passed)
      if (categorySlug && !categoryType && !subcatSlug) {
        const normalized = normalizeCategoryType(categorySlug);
        conditions.push(
          or(
            ilike(parentCategoryTable.slug, `%${normalized}%`),
            ilike(parentCategoryTable.name, `%${normalized}%`),
            ilike(subCategoryTable.slug, `%${normalized}%`),
            ilike(subCategoryTable.name, `%${normalized}%`)
          )
        );
      }

      // 4. Attribute filters (e.g. mens-color=indigo_blue, mens-fit=slim_fit, fabric, size, etc.)
      if (attributeFilters && Object.keys(attributeFilters).length > 0) {
        for (const [attrKey, attrVals] of Object.entries(attributeFilters)) {
          if (attrVals && attrVals.length > 0) {
            const matchClauses = attrVals.map(
              (val) => sql`(
                cao.value ILIKE ${'%' + val + '%'}
                OR cao.label ILIKE ${'%' + val + '%'}
                OR pav.value_text ILIKE ${'%' + val + '%'}
              )`
            );
            conditions.push(
              sql`EXISTS (
                SELECT 1 FROM ${productAttributeValuesTable} pav
                LEFT JOIN ${categoryAttributesTable} ca ON pav.attribute_id = ca.id
                LEFT JOIN ${categoryAttributeOptionsTable} cao ON pav.attribute_option_id = cao.id
                WHERE pav.product_id = ${productsTable.id}
                  AND (ca.slug ILIKE ${'%' + attrKey + '%'} OR ca.attribute_key ILIKE ${'%' + attrKey + '%'} OR ca.name ILIKE ${'%' + attrKey + '%'})
                  AND (${sql.join(matchClauses, sql` OR `)})
              )`
            );
          }
        }
      }

      // 5. Order By clauses (priceLow, priceHigh, newest, popular, featured)
      const priceExpr = sql`COALESCE(${pricingTable.price}::numeric, 0)`;

      let orderByClauses: any[] = [];
      if (sort === "priceLow" || sort === "price-asc") {
        orderByClauses = [asc(priceExpr), desc(productsTable.createdAt)];
      } else if (sort === "priceHigh" || sort === "price-desc") {
        orderByClauses = [desc(priceExpr), desc(productsTable.createdAt)];
      } else if (sort === "newest") {
        orderByClauses = [desc(productsTable.createdAt)];
      } else if (sort === "popular") {
        orderByClauses = [desc(productsTable.isFeatured), desc(productsTable.createdAt)];
      } else {
        // "featured" or default
        orderByClauses = [desc(productsTable.isFeatured), desc(productsTable.createdAt)];
      }

      const rows = await db
        .select({
          product: productsTable,
          category: parentCategoryTable,
          subCategory: subCategoryTable,
          defaultVariant: productVariantsTable,
          pricing: pricingTable,
        })
        .from(productsTable)
        .leftJoin(parentCategoryTable, eq(productsTable.categoryId, parentCategoryTable.id))
        .leftJoin(subCategoryTable, eq(productsTable.subcategoryId, subCategoryTable.id))
        .leftJoin(
          productVariantsTable,
          eq(productsTable.id, productVariantsTable.productId)
        )
        .leftJoin(
          pricingTable,
          eq(productVariantsTable.id, pricingTable.variantId)
        )
        .where(and(...conditions))
        .orderBy(...orderByClauses)
        .limit(limit)
        .offset(offset);

      // Deduplicate by product.id to prevent variant duplicate cards
      const seen = new Set<string>();
      const uniqueRows = rows.filter((r) => {
        if (!r.product?.id) return false;
        if (seen.has(r.product.id)) return false;
        seen.add(r.product.id);
        return true;
      });

      return uniqueRows;
    } catch (error) {
      console.warn("ProductRepository.getProducts error:", (error as Error).message);
      return [];
    }
  },

  async getProductById(productId: string) {
    if (!process.env.DATABASE_URL) return null;

    try {
      const [record] = await db
        .select({
          product: productsTable,
          category: categoriesTable,
        })
        .from(productsTable)
        .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
        .where(eq(productsTable.id, productId))
        .limit(1);

      return record ?? null;
    } catch (error) {
      console.warn("ProductRepository.getProductById fallback:", (error as Error).message);
      return null;
    }
  },

  async getProductVariants(productId: string) {
    if (!process.env.DATABASE_URL) return [];

    try {
      const variants = await db
        .select({
          variant: productVariantsTable,
          pricing: pricingTable,
          inventory: inventoryTable,
        })
        .from(productVariantsTable)
        .leftJoin(pricingTable, eq(productVariantsTable.id, pricingTable.variantId))
        .leftJoin(inventoryTable, eq(productVariantsTable.id, inventoryTable.variantId))
        .where(eq(productVariantsTable.productId, productId));

      return variants;
    } catch (error) {
      console.warn("ProductRepository.getProductVariants fallback:", (error as Error).message);
      return [];
    }
  },

  async getProductImages(productId: string) {
    if (!process.env.DATABASE_URL) return [];

    try {
      const media = await db
        .select()
        .from(productImagesTable)
        .where(eq(productImagesTable.productId, productId))
        .orderBy(asc(productImagesTable.displayOrder));

      return media;
    } catch (error) {
      console.warn("ProductRepository.getProductImages fallback:", (error as Error).message);
      return [];
    }
  },

  async getProductAttributes(productId: string) {
    if (!process.env.DATABASE_URL) return [];

    try {
      const attributes = await db
        .select({
          groupName: categoryAttributesTable.name,
          optionValue: sql<string>`coalesce(${categoryAttributeOptionsTable.label}, ${productAttributeValuesTable.valueText})`,
        })
        .from(productAttributeValuesTable)
        .leftJoin(
          categoryAttributesTable,
          eq(productAttributeValuesTable.attributeId, categoryAttributesTable.id)
        )
        .leftJoin(
          categoryAttributeOptionsTable,
          eq(productAttributeValuesTable.attributeOptionId, categoryAttributeOptionsTable.id)
        )
        .where(eq(productAttributeValuesTable.productId, productId));

      return attributes;
    } catch (error) {
      console.warn("ProductRepository.getProductAttributes fallback:", (error as Error).message);
      return [];
    }
  },
};
