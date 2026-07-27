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

  const res = await fetch(`/api/seller/products?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

export async function createProductClient(payload: any) {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to create product");
  }
  return res.json();
}

export async function deleteProductClient(id: string) {
  const res = await fetch(`/api/seller/products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }
  return res.json();
}

export async function createDraftProductClient() {
  const res = await fetch("/api/seller/products/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to create draft product");
  }
  return res.json();
}

export async function fetchProductImagesClient(productId: string) {
  const res = await fetch(`/api/seller/products/${productId}/images`);
  if (!res.ok) {
    throw new Error("Failed to fetch product images");
  }
  return res.json();
}

export async function uploadProductImageClient(productId: string, payload: any) {
  const res = await fetch(`/api/seller/products/${productId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to upload product image");
  }
  return res.json();
}

export async function deleteProductImageClient(productId: string, imageId: string) {
  const res = await fetch(`/api/seller/products/${productId}/images/${imageId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete product image");
  }
  return res.json();
}

export async function reorderProductImagesClient(productId: string, imageIds: string[]) {
  const res = await fetch(`/api/seller/products/${productId}/images/order`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageIds }),
  });
  if (!res.ok) {
    throw new Error("Failed to reorder product images");
  }
  return res.json();
}

export async function setPrimaryThumbnailClient(productId: string, imageId: string) {
  const res = await fetch(`/api/seller/products/${productId}/images/thumbnail`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageId }),
  });
  if (!res.ok) {
    throw new Error("Failed to set cover thumbnail");
  }
  return res.json();
}

export async function updateProductBasicInfoClient(productId: string, payload: any) {
  const res = await fetch(`/api/seller/products/${productId}/basic-info`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to update basic information");
  }
  return res.json();
}

export async function updateProductPricingClient(productId: string, payload: any) {
  const res = await fetch(`/api/seller/products/${productId}/pricing`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to update pricing");
  }
  return res.json();
}

export async function updateProductVariantsClient(productId: string, payload: any) {
  const res = await fetch(`/api/seller/products/${productId}/variants`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to update variants");
  }
  return res.json();
}

export async function updateProductInventoryClient(productId: string, payload: any) {
  const res = await fetch(`/api/seller/products/${productId}/inventory`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to update inventory");
  }
  return res.json();
}

export async function updateProductDeliveryClient(productId: string, payload: any) {
  const res = await fetch(`/api/seller/products/${productId}/delivery`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to update delivery logistics");
  }
  return res.json();
}

export async function updateProductSeoClient(productId: string, payload: any) {
  const res = await fetch(`/api/seller/products/${productId}/seo`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to update SEO tags");
  }
  return res.json();
}

export async function getProductClient(productId: string) {
  const res = await fetch(`/api/seller/products/${productId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch product details");
  }
  const body = await res.json();
  return body.data;
}

export async function duplicateProductClient(productId: string) {
  const res = await fetch(`/api/seller/products/${productId}/duplicate`, {
    method: "POST",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to duplicate product");
  }
  return res.json();
}

export async function bulkUploadProductsClient(products: any[]) {
  const res = await fetch("/api/seller/products/bulk-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed bulk product upload");
  }
  return res.json();
}

export async function fetchCategoriesClient() {
  const res = await fetch("/api/seller/products/categories");
  if (!res.ok) {
    throw new Error("Failed to fetch categories list");
  }
  const body = await res.json();
  return body.data;
}


export async function publishProductClient(productId: string, status: 'DRAFT' | 'PUBLISHED' = 'PUBLISHED') {
  const res = await fetch(`/api/seller/products/${productId}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to publish product");
  }
  return res.json();
}









