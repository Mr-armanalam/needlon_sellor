import { apiClient } from "@/modules/shared/api/api-client";
import type { Product } from "@/db/schema/catalog/products";
import type {
  CreateProductDto,
  CreateProductImageDto,
  ProductDto,
  PublishProductDto,
  SetPrimaryThumbnailDto,
  UpdateBasicInfoDto,
  UpdateDeliveryDto,
  UpdateImageOrderDto,
  UpdateInventoryDto,
  UpdatePricingDto,
  UpdateSeoDto,
  UpdateVariantsDto,
} from "../dto";
import type { ProductCardSourceItem } from "../mappers/product-card.mapper";
import type { ProductVisibility } from "../types";

/**
 * Response shapes for the seller product endpoints.
 *
 * `apiClient` unwraps the `{ success, data }` envelope and resolves with
 * `data`, so each type below describes the unwrapped payload. Only the
 * fields actually consumed by callers are declared.
 */

export interface ProductListResponse {
  items: ProductCardSourceItem[];
  nextCursor: string | null;
}

/** Flattened product detail consumed by the add/edit product wizard form. */
export interface ProductFormDetailResponse {
  id?: string;
  name?: string;
  brandLabel?: string;
  brandId?: string | null;
  brandName?: string;
  category?: string;
  categoryId?: string | null;
  subcategory?: string;
  subcategoryId?: string | null;
  descriptionStory?: string;
  currencyCode?: string;
  retailPrice?: string;
  discountOfferRate?: string;
  compareAtPrice?: string;
  costPrice?: string;
  minimumAdvertisedPrice?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  isTaxInclusive?: boolean;
  sizesMatrix?: string;
  colorsTrack?: string;
  fabricMaterial?: string;
  sleevesStyle?: string;
  fitType?: string;
  occasionFocus?: string;
  genderProfile?: string;
  targetAgeGroup?: string;
  boutiqueStockCount?: string;
  uniqueSku?: string;
  lowStockThreshold?: string;
  reservedQuantity?: string;
  allowBackorder?: boolean;
  lastAdjustedAt?: string;
  barcode?: string;
  position?: string;
  pickupHubId?: string | null;
  pickupHubAddress?: string;
  shippingPartnerId?: string | null;
  shippingMethodId?: string | null;
  deliveryZone?: string;
  packageWeight?: string;
  deliveryRadiusRange?: string;
  estimatedDeliveryWindow?: string;
  searchKeywords?: string;
  customVisibility?: ProductVisibility;
  isCustomizable?: boolean;
  orderCount?: number;
  salesCount?: number;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string | null;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string | null;
  mediaUrls?: string[];
  customAttributes?: Array<{ name: string; value: string }>;
  status?: string;
}

export interface ProductCategoryItem {
  id: string;
  name: string;
  parentId?: string | null;
}

export interface FetchCategoriesResponse {
  categories: ProductCategoryItem[];
  subcategories?: ProductCategoryItem[];
  allCategories?: ProductCategoryItem[];
}

export interface VerifiedBrandItem {
  id: string;
  name: string;
}

export interface FetchBrandsResponse {
  brands: VerifiedBrandItem[];
}

export interface ShippingPartnerItem {
  id: string;
  name?: string;
  carrierName?: string;
  serviceType?: string;
}

export interface FetchShippingPartnersResponse {
  partners: ShippingPartnerItem[];
}

/** Matches the pickup hub shape from the delivery settings (PickupHubDto). */
export interface PickupHubItem {
  id?: string;
  hubName: string;
  address: string;
  city: string;
  pincode: string;
}

export interface FetchDeliverySettingsResponse {
  pickupHub?: PickupHubItem;
}

export interface ProductImageItem {
  id: string;
  imageUrl: string;
  fileName: string;
  isPrimary: boolean;
  displayOrder: number;
  mediaType?: string;
  storageKey?: string;
}

/** Minimal result of a product mutation; callers only consume `id`. */
export interface ProductMutationResponse {
  id: string;
  status?: string;
}

export interface CreateDraftProductResponse {
  id: string;
}

export interface DeleteProductImageResponse {
  deleted: boolean;
}

export interface BulkUploadProductsResponse {
  count: number;
  items: Product[];
}

/**
 * Step payloads. The DTOs in `../dto` cover only part of each step, so
 * these extend them with the remaining fields the wizard sends (matching
 * the corresponding schemas in `../validations`).
 */

export interface UpdateProductBasicInfoPayload extends UpdateBasicInfoDto {
  brandId?: string;
  brandName?: string;
  categoryId?: string;
  subcategoryId?: string;
  isCustomizable?: boolean;
}

export interface UpdateProductPricingPayload extends UpdatePricingDto {
  currencyCode?: string;
  compareAtPrice?: string | number;
  costPrice?: string | number;
  minimumAdvertisedPrice?: string | number;
  effectiveFrom?: string;
  effectiveUntil?: string;
  isTaxInclusive?: boolean;
}

export type UpdateProductVariantsPayload = UpdateVariantsDto;

export interface UpdateProductInventoryPayload extends UpdateInventoryDto {
  lowStockThreshold?: string | number;
  reservedQuantity?: string | number;
  allowBackorder?: boolean;
  barcode?: string;
  position?: string | number;
}

export interface UpdateProductDeliveryPayload extends UpdateDeliveryDto {
  pickupHubId?: string;
  shippingPartnerId?: string;
  shippingMethodId?: string;
  deliveryZone?: string;
}

export interface UpdateProductSeoPayload extends UpdateSeoDto {
  slug?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
}

export async function fetchProductsClient(
  activeTab?: string,
  searchQuery?: string,
  category?: string,
  size?: string,
  priceRange?: string,
  stockStatus?: string,
  sort?: string
) {
  const params = new URLSearchParams();
  if (activeTab && activeTab !== "All") {
    params.append("status", activeTab.toUpperCase().replace(/\s+/g, "_"));
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  if (category && category !== "Category") {
    params.append("category", category);
  }
  if (size && size !== "Size") {
    params.append("size", size);
  }
  if (priceRange && priceRange !== "Price Range") {
    params.append("priceRange", priceRange);
  }
  if (stockStatus && stockStatus !== "Stock Status") {
    params.append("stockStatus", stockStatus);
  }
  if (sort) {
    params.append("sort", sort);
  }

  return apiClient.get<ProductListResponse>(`/api/seller/products?${params.toString()}`);
}

export async function createProductClient(payload: CreateProductDto) {
  return apiClient.post<ProductDto, CreateProductDto>("/api/seller/products", payload);
}

export async function deleteProductClient(id: string) {
  return apiClient.delete<ProductMutationResponse>(`/api/seller/products/${id}`);
}

export async function createDraftProductClient() {
  return apiClient.post<CreateDraftProductResponse>("/api/seller/products/draft", {});
}

export async function fetchProductImagesClient(productId: string) {
  return apiClient.get<ProductImageItem[]>(`/api/seller/products/${productId}/images`);
}

export async function uploadProductImageClient(
  productId: string,
  payload: FormData | CreateProductImageDto
) {
  return apiClient.post<ProductImageItem, FormData | CreateProductImageDto>(
    `/api/seller/products/${productId}/images`,
    payload
  );
}

export async function deleteProductImageClient(productId: string, imageId: string) {
  return apiClient.delete<DeleteProductImageResponse>(`/api/seller/products/${productId}/images/${imageId}`);
}

export async function reorderProductImagesClient(productId: string, imageIds: string[]) {
  return apiClient.patch<ProductImageItem[], UpdateImageOrderDto>(`/api/seller/products/${productId}/images/order`, { imageIds });
}

export async function setPrimaryThumbnailClient(productId: string, imageId: string) {
  return apiClient.patch<ProductImageItem, SetPrimaryThumbnailDto>(`/api/seller/products/${productId}/images/thumbnail`, { imageId });
}

export async function updateProductBasicInfoClient(productId: string, payload: UpdateProductBasicInfoPayload) {
  return apiClient.patch<ProductMutationResponse, UpdateProductBasicInfoPayload>(`/api/seller/products/${productId}/basic-info`, payload);
}

export async function updateProductPricingClient(productId: string, payload: UpdateProductPricingPayload) {
  return apiClient.patch<ProductMutationResponse, UpdateProductPricingPayload>(`/api/seller/products/${productId}/pricing`, payload);
}

export async function updateProductVariantsClient(productId: string, payload: UpdateProductVariantsPayload) {
  return apiClient.patch<ProductMutationResponse, UpdateProductVariantsPayload>(`/api/seller/products/${productId}/variants`, payload);
}

export async function updateProductInventoryClient(productId: string, payload: UpdateProductInventoryPayload) {
  return apiClient.patch<ProductMutationResponse, UpdateProductInventoryPayload>(`/api/seller/products/${productId}/inventory`, payload);
}

export async function updateProductDeliveryClient(productId: string, payload: UpdateProductDeliveryPayload) {
  return apiClient.patch<ProductMutationResponse, UpdateProductDeliveryPayload>(`/api/seller/products/${productId}/delivery`, payload);
}

export async function updateProductSeoClient(productId: string, payload: UpdateProductSeoPayload) {
  return apiClient.patch<ProductMutationResponse, UpdateProductSeoPayload>(`/api/seller/products/${productId}/seo`, payload);
}

export async function getProductClient(productId: string) {
  return apiClient.get<ProductFormDetailResponse>(`/api/seller/products/${productId}`);
}

export async function duplicateProductClient(productId: string) {
  return apiClient.post<ProductMutationResponse>(`/api/seller/products/${productId}/duplicate`, {});
}

export async function bulkUploadProductsClient(products: Record<string, unknown>[]) {
  return apiClient.post<BulkUploadProductsResponse, { products: Record<string, unknown>[] }>("/api/seller/products/bulk-upload", { products });
}

export async function fetchCategoriesClient() {
  return apiClient.get<FetchCategoriesResponse>("/api/seller/products/categories");
}

export async function fetchBrandsClient() {
  return apiClient.get<FetchBrandsResponse>("/api/seller/brands");
}

export async function fetchDeliverySettingsClient() {
  return apiClient.get<FetchDeliverySettingsResponse>("/api/seller/delivery/settings");
}

export async function fetchShippingPartnersClient() {
  return apiClient.get<FetchShippingPartnersResponse>("/api/seller/delivery/partners");
}

export async function publishProductClient(productId: string, status: 'DRAFT' | 'PUBLISHED' = 'PUBLISHED') {
  return apiClient.post<ProductMutationResponse, PublishProductDto>(`/api/seller/products/${productId}/publish`, { status });
}
