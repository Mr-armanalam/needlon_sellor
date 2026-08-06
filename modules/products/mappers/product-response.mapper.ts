import type { Product } from "@/db/schema/catalog/products";
import type {
    ProductDto,
    ProductListItemDto,
    ProductStatusDto,
    ProductSummaryDto,
} from "../dto";

export function toProductDto(product: Product): ProductDto {
    return {
        id: product.id,
        storeId: product.storeId || "",
        categoryId: product.categoryId,
        name: product.name,
        slug: product.slug,
        sku: null,
        brand: null,
        model: null,
        hsnCode: null,
        countryOfOrigin: null,
        shortDescription: product.shortDescription || null,
        description: product.description || null,
        warranty: null,
        productType: product.productType || "PHYSICAL",
        visibility: product.visibility || "PRIVATE",
        status: product.status || "DRAFT",
        isFeatured: product.isFeatured ?? false,
        isAvailable: product.status === "PUBLISHED",
        sortOrder: 0,
        metadata: {} as any,
        publishedAt: product.publishedAt,
        archivedAt: null,
        createdBy: null,
        updatedBy: null,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        deletedAt: product.deletedAt,
    };
}

export function toProductDtos(products: Product[]): ProductDto[] {
    return products.map(toProductDto);
}

export function toProductListItemDto(product: Product): ProductListItemDto {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: null,
        brand: null,
        status: product.status,
        visibility: product.visibility,
        isAvailable: product.status === "PUBLISHED",
        isFeatured: product.isFeatured ?? false,
        updatedAt: product.updatedAt,
    };
}

export function toProductListItemDtos(products: Product[]): ProductListItemDto[] {
    return products.map(toProductListItemDto);
}

export function toProductStatusDto(product: Product): ProductStatusDto {
    return {
        id: product.id,
        status: product.status,
        visibility: product.visibility,
        isAvailable: product.status === "PUBLISHED",
        publishedAt: product.publishedAt,
        archivedAt: null,
    };
}

export function toProductSummaryDto(data: {
    totalProducts: number;
    activeProducts: number;
    draftProducts: number;
    archivedProducts: number;
}): ProductSummaryDto {
    return {
        totalProducts: data.totalProducts,
        activeProducts: data.activeProducts,
        draftProducts: data.draftProducts,
        archivedProducts: data.archivedProducts,
    };
}

/**
 * Legacy class wrappers for backward compatibility
 */
export class ProductResponseMapper {
    static toDto(product: Product): ProductDto {
        return toProductDto(product);
    }
    static toListDto(product: Product): ProductListItemDto {
        return toProductListItemDto(product);
    }
    static toDtos(products: Product[]): ProductDto[] {
        return toProductDtos(products);
    }
    static toListDtos(products: Product[]): ProductListItemDto[] {
        return toProductListItemDtos(products);
    }
}

export class ProductTransformer {
    static toDto(product: Product): ProductDto {
        return toProductDto(product);
    }
    static toDtos(products: Product[]): ProductDto[] {
        return toProductDtos(products);
    }
}

export class ProductListTransformer {
    static toDto(product: Product): ProductListItemDto {
        return toProductListItemDto(product);
    }
    static toDtos(products: Product[]) {
        return toProductListItemDtos(products);
    }
}

export class ProductStatusTransformer {
    static toDto(product: Product): ProductStatusDto {
        return toProductStatusDto(product);
    }
}

export class ProductSummaryTransformer {
    static toDto(data: {
        totalProducts: number;
        activeProducts: number;
        draftProducts: number;
        archivedProducts: number;
    }): ProductSummaryDto {
        return toProductSummaryDto(data);
    }
}