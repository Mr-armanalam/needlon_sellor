export type ProductStatus = "DRAFT" | "INCOMPLETE" | "PUBLISHED" | "ARCHIVED";
export type ProductVisibility = "PUBLIC" | "HIDDEN" | "PRIVATE";
export type ProductType = "PHYSICAL" | "DIGITAL" | "SERVICE";
export type VariantStatus = "DRAFT" | "ACTIVE" | "INACTIVE";
export type MediaType = "IMAGE" | "VIDEO" | "MODEL_3D" | "AR" | "SPIN_360";

export interface ProductEntity {
  id: string;
  sellerId: string;
  categoryId: string;
  brandId?: string | null;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  productType: ProductType;
  status: ProductStatus;
  visibility: ProductVisibility;
  isFeatured: boolean;
  publishedAt?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariantEntity {
  id: string;
  productId: string;
  sku: string;
  barcode?: string | null;
  price: string;
  compareAtPrice?: string | null;
  costPrice?: string | null;
  weightGrams?: number | null;
  status: VariantStatus;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ProductMediaEntity {
  id: string;
  productId: string;
  variantId?: string | null;
  storageKey: string;
  cdnUrl: string;
  mediaType: MediaType;
  altText?: string | null;
  displayOrder: number;
  isPrimary: boolean;
  status: string;
}

export interface ProductCardViewModel {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: string;
  discount: string;
  stock: number;
  views: number;
  likes: number;
  orders: number;
  rating: number;
  status: string;
  bg: string;
  initials: string;
}
