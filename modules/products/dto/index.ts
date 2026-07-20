import { ProductStatus, ProductVisibility, ProductType } from "../types";

export interface CreateProductDTO {
  sellerId: string;
  categoryId: string;
  brandId?: string | null;
  name: string;
  shortDescription?: string;
  description?: string;
  productType?: ProductType;
  status?: ProductStatus;
  visibility?: ProductVisibility;
  isFeatured?: boolean;

  defaultVariant?: {
    sku: string;
    barcode?: string;
    price: string;
    compareAtPrice?: string;
    costPrice?: string;
    weightGrams?: number;
  };
}

export interface UpdateProductDTO {
  id: string;
  name?: string;
  shortDescription?: string;
  description?: string;
  categoryId?: string;
  brandId?: string | null;
  productType?: ProductType;
  status?: ProductStatus;
  visibility?: ProductVisibility;
  isFeatured?: boolean;
}

export interface ProductListQueryDTO {
  sellerId: string;
  categoryId?: string;
  status?: ProductStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProductListResponseDTO {
  items: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
