import {
    and,
    asc,
    eq,
    gt,
    ilike,
} from "drizzle-orm";

import { db } from "@/db";

import {
    productsTable,
    Product, NewProduct,
} from "@/db/schema/catalog/products";

import {
    ProductRepository,
    ProductListOptions,
    ProductListResult,
} from "./product.repository.interface";

import {
    CreateProductDto,
    UpdateProductDto,
} from "../../dto";

export class DrizzleProductRepository
    implements ProductRepository
{
    async create(
        data: CreateProductDto,
    ): Promise<Product> {
        const [product] =
            await db
                .insert(productsTable)
                .values(data)
                .returning();

        return product;
    }

    async update(
        id: string,
        data: UpdateProductDto,
    ): Promise<Product> {
        const [product] =
            await db
                .update(productsTable)
                .set({
                    ...data,
                    updatedAt: new Date(),
                })
                .where(eq(productsTable.id, id))
                .returning();

        return product;
    }

    async delete(
        id: string,
    ): Promise<void> {
        await db
            .delete(productsTable)
            .where(eq(productsTable.id, id));
    }

    async findById(
        id: string,
    ): Promise<Product | null> {
        const [product] = await db
            .select()
            .from(productsTable)
            .where(eq(productsTable.id, id))
            .limit(1);

        return product ?? null;
    }

    async updateDraft(
        id: string,
        input: any,
    ): Promise<Product> {
        return this.update(id, input);
    }

    async findDraftById(
        id: string,
    ): Promise<Product | null> {
        return this.findById(id);
    }

    async deleteDraft(
        id: string,
    ): Promise<void> {
        return this.delete(id);
    }

    async createDraft(
        data: any,
    ): Promise<Product> {
        let categoryId = data.categoryId;
        if (!categoryId) {
            const { categoriesTable } = await import("@/db/schema/catalog/categories");
            const [firstCategory] = await db
                .select({ id: categoriesTable.id })
                .from(categoriesTable)
                .limit(1);

            if (firstCategory) {
                categoryId = firstCategory.id;
            } else {
                const [newCat] = await db
                    .insert(categoriesTable)
                    .values({
                        name: "General",
                        slug: "general",
                        code: "CAT-GENERAL",
                        path: "/general",
                        level: 0,
                    })
                    .returning();
                categoryId = newCat.id;
            }
        }

        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 7);

        const draftValues: NewProduct = {
            storeId: data?.sellerId || data?.storeId || "00000000-0000-0000-0000-000000000001",
            categoryId: categoryId,
            name: data.name || "Untitled Draft",
            slug: data.slug || `draft-${timestamp}-${randomSuffix}`,
            status: data.status || "DRAFT",
        };

        const product = await db.transaction(async (tx) => {
            const [prod] = await tx
                .insert(productsTable)
                .values(draftValues)
                .returning();

            // Create default variant
            const { productVariantsTable } = await import("@/db/schema/catalog/products/product-variants/table");
            const [variant] = await tx
                .insert(productVariantsTable)
                .values({
                    productId: prod.id,
                    sku: `sku-${prod.id}`,
                    price: "0.00",
                    position: 0,
                    status: "ACTIVE",
                })
                .returning();

            // Create default inventory
            const { inventoryTable } = await import("@/db/schema/catalog/products/inventory/table");
            await tx.insert(inventoryTable).values({
                variantId: variant.id,
                quantity: 0,
                lowStockThreshold: 5,
            });

            // Create default pricing
            const { pricingTable } = await import("@/db/schema/catalog/products/pricing/table");
            await tx.insert(pricingTable).values({
                variantId: variant.id,
                price: "0.00",
                currencyCode: "INR",
                isTaxInclusive: true,
            });

            // Create default shipping
            const { shippingTable } = await import("@/db/schema/catalog/products/shipping/table");
            await tx.insert(shippingTable).values({
                variantId: variant.id,
                weight: "0.00",
                weightUnit: "KG",
                requiresShipping: true,
                isFreeShipping: false,
            });

            // Create default SEO
            const { productSeoTable } = await import("@/db/schema/catalog/products/product-seo/table");
            await tx.insert(productSeoTable).values({
                productId: prod.id,
                slug: prod.slug,
                metaTitle: prod.name,
                metaDescription: "",
            });

            // Create default AI record
            const { productAiTable } = await import("@/db/schema/catalog/products/product-ai/table");
            await tx.insert(productAiTable).values({
                productId: prod.id,
                summary: "",
                qualityScore: 0,
            });

            return prod;
        });

        return product;
    }

    async list(
        options: ProductListOptions,
    ): Promise<ProductListResult> {
        const conditions = [
            eq(
                productsTable.storeId,
                options.storeId,
            )
        ];

        if (options.status) {
            conditions.push(
                eq(
                    productsTable.status,
                    options.status as never,
                ),
            );
        }

        if (options.search) {
            conditions.push(
                ilike(
                    productsTable.name,
                    `%${options.search}%`,
                ),
            );
        }

        if (options.cursor) {
            conditions.push(
                gt(
                    productsTable.id,
                    options.cursor,
                ),
            );
        }

        const items =
            await db
                .select()
                .from(productsTable)
                .where(and(...conditions))
                .orderBy(asc(productsTable.id))
                .limit(options.limit + 1);

        let nextCursor: string | null = null;

        if (items.length > options.limit) {
            const next = items.pop();

            nextCursor = next!.id;
        }

        return {
            items,
            nextCursor,
        };
    }
}