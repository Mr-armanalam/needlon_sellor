import type { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import type { categoriesTable } from "@needlon/db/db/schema/catalog/categories/table";
import type { productVariantsTable } from "@needlon/db/db/schema/catalog/products/product-variants/table";
import type { pricingTable } from "@needlon/db/db/schema/catalog/products/pricing/table";
import type { productImagesTable } from "@needlon/db/db/schema/catalog/products/product-images/table";

/** DB row types inferred from the Drizzle schema. */
export type DbProductRecord = typeof productsTable.$inferSelect;
export type DbCategoryRecord = typeof categoriesTable.$inferSelect;
export type DbPricingRecord = typeof pricingTable.$inferSelect;
/** Variant rows as joined by ProductRepository: the variant row, its pricing, and a legacy price field some rows carry. */
export type DbProductVariantRecord = typeof productVariantsTable.$inferSelect & {
  price?: string | number | null;
};
export interface DbProductVariantJoin {
  variant?: DbProductVariantRecord | null;
  pricing?: DbPricingRecord | null;
  name?: string | null;
}
/** Product image rows: the schema column is imageUrl; mediaUrl/url are accepted legacy aliases. */
export type DbProductImageRecord = typeof productImagesTable.$inferSelect & {
  mediaUrl?: string | null;
  url?: string | null;
};

export interface ProductWithCategoryDTO {
  product: {
    id: string;
    name: string;
    categoryId?: string | null;
    price: number;
    mrp_price: number;
    image: string;
    modalImage: string[];
    sizes: string[];
    quantity?: number;
    averageRating?: string;
    salesCount?: number;
    reviewCount?: number;
    isPremium?: boolean;
    seller?: string;
    tagName?: string;
    description?: string;
    slug?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  totalSales: number;
  Category: {
    categoryName: string;
    categoryType: string;
  };
  category: {
    id: string;
    category: string;
    CatType: string;
    SubCatType: string;
    contentTag: string;
    descriptiveContent: string;
  };
}

export interface TransformedProductCardDTO {
  id: string;
  name: string;
  price: number;
  mrp_price: number;
  image: string;
  modalImage: string[];
  sizes: string[];
  category: string;
  catType: string;
  rating: string;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600";

export function transformDbProductToDto(
  row: {
    product: DbProductRecord;
    category?: DbCategoryRecord | null;
    subCategory?: DbCategoryRecord | null;
    defaultVariant?: DbProductVariantRecord | null;
    pricing?: DbPricingRecord | null;
  },
  images: DbProductImageRecord[] = [],
  variants: DbProductVariantJoin[] = []
): ProductWithCategoryDTO {
  const p = row.product;
  const cat = row.category;
  const subcat = row.subCategory;
  const variantPricing = variants[0]?.pricing;
  const pr = row.pricing || variantPricing;

  const price = pr?.price
    ? Number(pr.price)
    : (row.defaultVariant?.price
        ? Number(row.defaultVariant.price)
        : (variants[0]?.variant?.price ? Number(variants[0].variant.price) : 2499));
  const mrpPrice = pr?.compareAtPrice ? Number(pr.compareAtPrice) : Math.round(price * 1.3);

  const mediaUrls = images.length > 0
    ? images.map((m) => m.imageUrl || m.mediaUrl || m.url).filter((url): url is string => Boolean(url))
    : [DEFAULT_IMAGE];

  const primaryImage = mediaUrls[0] || DEFAULT_IMAGE;

  const sizes = variants.length > 0
    ? variants.map((v) => v.variant?.name || v.name).filter((s): s is string => Boolean(s))
    : ["S", "M", "L", "XL"];

  const catName = cat?.name || "Apparel";
  const catSlug = cat?.slug || "apparel";

  return {
    product: {
      id: p.id,
      name: p.name,
      categoryId: p.categoryId,
      price,
      mrp_price: mrpPrice,
      image: primaryImage,
      modalImage: mediaUrls,
      sizes,
      quantity: 50,
      averageRating: "4.80",
      salesCount: 120,
      reviewCount: 25,
      isPremium: Boolean(p.isFeatured),
      seller: p.storeId || "seller-1",
      tagName: p.isFeatured ? "Featured" : "New Arrival",
      description: p.description || p.shortDescription || "",
      slug: p.slug,
      createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
      updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    },
    totalSales: 120,
    Category: {
      categoryName: catName,
      categoryType: catSlug,
    },
    category: {
      id: cat?.id || "cat-default",
      category: catName,
      CatType: catSlug,
      SubCatType: subcat?.slug || catSlug,
      contentTag: "Classic Collection",
      descriptiveContent: cat?.description || "Curated premium fashion collection.",
    },
  };
}

export function transformToProductCard(dto: ProductWithCategoryDTO): TransformedProductCardDTO {
  return {
    id: dto.product.id,
    name: dto.product.name,
    price: Number(dto.product.price),
    mrp_price: Number(dto.product.mrp_price),
    image: dto.product.image,
    modalImage: dto.product.modalImage || [dto.product.image],
    sizes: dto.product.sizes || [],
    category: dto.category.category,
    catType: dto.category.CatType,
    rating: dto.product.averageRating || "4.8",
  };
}
