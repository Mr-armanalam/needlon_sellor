import { productStatusEnum, productTypeEnum, productVisibilityEnum } from "@/db/schema/catalog/enums";
import { ProductMetadata } from "@/db/schema/catalog/products";

export interface ProductDto {
    id: string;
    storeId: string;
    categoryId: string;
    name: string;
    slug: string;
    sku: string | null;
    brand: string | null;
    model: string | null;
    hsnCode: string | null;
    countryOfOrigin: string | null;
    shortDescription: string | null;
    description: string | null;
    warranty: string | null;
    productType: string;
    visibility: string;
    status: string;
    isFeatured: boolean;
    isAvailable: boolean;
    sortOrder: number;
    metadata: ProductMetadata;
    publishedAt: Date | null;
    archivedAt: Date | null;
    createdBy: string | null;
    updatedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface CreateProductDto {
    storeId: string;
    categoryId: string;
    name: string;
    slug: string;
    sku: string;
    brand?: string;
    model?: string;
    hsnCode?: string;
    countryOfOrigin?: string;
    shortDescription?: string;
    description?: string;
    warranty?: string;
    productType: typeof productTypeEnum.enumValues[number];
    visibility: typeof productVisibilityEnum.enumValues[number];
    status?: typeof productStatusEnum.enumValues[number];
    metadata?: Record<string, unknown>;
    sortOrder?: number;
    isFeatured?: boolean;
    isAvailable?: boolean;
    createdBy?: string;
    updatedBy?: string;
}

export interface UpdateProductDto {
    categoryId?: string;
    name?: string;
    slug?: string;
    sku?: string;
    brand?: string;
    model?: string;
    hsnCode?: string;
    countryOfOrigin?: string;
    shortDescription?: string;
    description?: string;
    warranty?: string;
    productType?: typeof productTypeEnum.enumValues[number];
    visibility?: typeof productVisibilityEnum.enumValues[number];
    status?: typeof productStatusEnum.enumValues[number];
    metadata?: Record<string, unknown>;
    sortOrder?: number;
    isFeatured?: boolean;
    isAvailable?: boolean;
}

export interface UpdateBasicInfoDto {
  name: string;
  brandLabel?: string;
  category?: string;
  subcategory?: string;
  descriptionStory?: string;
  slug?: string;
  hsnCode?: string;
  countryOfOrigin?: string;
}

export interface UpdateDeliveryDto {
  pickupHubAddress?: string;
  packageWeight?: string | number;
  deliveryRadiusRange?: string;
  estimatedDeliveryWindow?: string;
}

export interface UpdateInventoryDto {
  boutiqueStockCount?: number | string;
  uniqueSku?: string;
}

export interface UpdatePricingDto {
  retailPrice: string | number;
  discountOfferRate?: string | number;
}

export interface UpdateSeoDto {
  searchKeywords?: string;
  customVisibility?: string;
}

export interface UpdateVariantsDto {
  sizesMatrix?: string;
  colorsTrack?: string;
  fabricMaterial?: string;
  sleevesStyle?: string;
  fitType?: string;
  occasionFocus?: string;
  genderProfile?: string;
  targetAgeGroup?: string;
}

export interface PublishProductDto {
  status?: "DRAFT" | "PUBLISHED";
  publishedAt?: Date;
}

export interface ArchiveProductDto {
    reason?: string;
}

export interface DuplicateProductRequest {
    productId: string;
    includeImages?: boolean;
    includeVariants?: boolean;
}

export interface UpdateProductStatusDto {
    status: string;
}

export interface ProductFilterRequest {
    categoryId?: string;
    brandId?: string;
    status?: string;
    hasVariants?: boolean;
    minPrice?: number;
    maxPrice?: number;
}

export interface ProductSearchDto {
    query?: string;
    categoryId?: string;
    status?: string;
    visibility?: string;
    productType?: string;
    page?: number;
    pageSize?: number;
    cursor?: string;
}

export interface ProductListItemDto {
    id: string;
    storeId: string;
    categoryId: string;
    name: string;
    slug: string;
    shortDescription: string | null;
    price: string | null;
    status: string;
    createdAt: Date;
}

export interface ProductStatusDto {
    id: string;
    status: string;
    visibility: string;
    isAvailable: boolean;
    publishedAt: Date | null;
    archivedAt: Date | null;
}

export interface ProductSummaryDto {
    totalProducts: number;
    activeProducts: number;
    draftProducts: number;
    archivedProducts: number;
}

