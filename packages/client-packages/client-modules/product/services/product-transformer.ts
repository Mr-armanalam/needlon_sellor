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
    product: any;
    category?: any;
    defaultVariant?: any;
    pricing?: any;
  },
  images: any[] = [],
  variants: any[] = []
): ProductWithCategoryDTO {
  const p = row.product;
  const cat = row.category;
  const variantPricing = variants[0]?.pricing;
  const pr = row.pricing || variantPricing;

  const price = pr?.price
    ? Number(pr.price)
    : (row.defaultVariant?.price
        ? Number(row.defaultVariant.price)
        : (variants[0]?.variant?.price ? Number(variants[0].variant.price) : 2499));
  const mrpPrice = pr?.compareAtPrice ? Number(pr.compareAtPrice) : Math.round(price * 1.3);

  const mediaUrls = images.length > 0
    ? images.map((m) => m.imageUrl || m.mediaUrl || m.url).filter(Boolean)
    : [DEFAULT_IMAGE];

  const primaryImage = mediaUrls[0] || DEFAULT_IMAGE;

  const sizes = variants.length > 0
    ? variants.map((v) => v.variant?.name || v.name).filter(Boolean)
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
      SubCatType: catSlug,
      contentTag: "Classic Collection",
      descriptiveContent: cat?.description || "Curated premium fashion collection.",
    },
  };
}

export function transformToProductCard(dto: any): TransformedProductCardDTO {
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
