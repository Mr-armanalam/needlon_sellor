import { apiClient } from "@/modules/shared/api/api-client";

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
    params.append("status", activeTab.toUpperCase().replaceAll(" ", "_"));
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

  return apiClient.get<any>(`/api/seller/products?${params.toString()}`);
}

export async function createProductClient(payload: any) {
  return apiClient.post<any>("/api/products", payload);
}

export async function deleteProductClient(id: string) {
  return apiClient.delete<any>(`/api/seller/products/${id}`);
}

export async function createDraftProductClient() {
  return apiClient.post<any>("/api/seller/products/draft", {});
}

export async function fetchProductImagesClient(productId: string) {
  return apiClient.get<any>(`/api/seller/products/${productId}/images`);
}

export async function uploadProductImageClient(productId: string, payload: any) {
  return apiClient.post<any>(`/api/seller/products/${productId}/images`, payload);
}

export async function deleteProductImageClient(productId: string, imageId: string) {
  return apiClient.delete<any>(`/api/seller/products/${productId}/images/${imageId}`);
}

export async function reorderProductImagesClient(productId: string, imageIds: string[]) {
  return apiClient.patch<any>(`/api/seller/products/${productId}/images/order`, { imageIds });
}

export async function setPrimaryThumbnailClient(productId: string, imageId: string) {
  return apiClient.patch<any>(`/api/seller/products/${productId}/images/thumbnail`, { imageId });
}

export async function updateProductBasicInfoClient(productId: string, payload: any) {
  return apiClient.patch<any>(`/api/seller/products/${productId}/basic-info`, payload);
}

export async function updateProductPricingClient(productId: string, payload: any) {
  return apiClient.patch<any>(`/api/seller/products/${productId}/pricing`, payload);
}

export async function updateProductVariantsClient(productId: string, payload: any) {
  return apiClient.patch<any>(`/api/seller/products/${productId}/variants`, payload);
}

export async function updateProductInventoryClient(productId: string, payload: any) {
  return apiClient.patch<any>(`/api/seller/products/${productId}/inventory`, payload);
}

export async function updateProductDeliveryClient(productId: string, payload: any) {
  return apiClient.patch<any>(`/api/seller/products/${productId}/delivery`, payload);
}

export async function updateProductSeoClient(productId: string, payload: any) {
  return apiClient.patch<any>(`/api/seller/products/${productId}/seo`, payload);
}

export async function getProductClient(productId: string) {
  return apiClient.get<any>(`/api/seller/products/${productId}`);
}

export async function duplicateProductClient(productId: string) {
  return apiClient.post<any>(`/api/seller/products/${productId}/duplicate`, {});
}

export async function bulkUploadProductsClient(products: any[]) {
  return apiClient.post<any>("/api/seller/products/bulk-upload", { products });
}

export async function fetchCategoriesClient() {
  return apiClient.get<any>("/api/seller/products/categories");
}

export async function publishProductClient(productId: string, status: 'DRAFT' | 'PUBLISHED' = 'PUBLISHED') {
  return apiClient.post<any>(`/api/seller/products/${productId}/publish`, { status });
}
