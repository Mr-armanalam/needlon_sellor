import { relations } from "drizzle-orm";

import { seller } from "@/db/schema/seller";

import { categoriesTable } from "@/db/schema/catalog/categories";

import { productsTable } from "./table";
import {sellerStore} from "@/db/schema/seller/seller-store";
import {productImagesTable} from "@/db/schema/catalog/products/product-images";
import {productVideosTable} from "@/db/schema/catalog/products/product-videos/table";
import {productVariantsTable} from "@/db/schema/catalog/products/product-variants/table";
import {productVariantOptionsTable} from "@/db/schema/catalog/products/product-variant-options/table";
import {productAttributeValuesTable} from "@/db/schema/catalog/products/product-attribute-values/table";
import {productSeoTable} from "@/db/schema/catalog/products/product-seo/table";
import {productTagMappingsTable} from "@/db/schema/catalog/products/product-tag-mappings";
import {productAiTable} from "@/db/schema/catalog/products/product-ai";

/**
 * ============================================================
 * Products Relations
 * ============================================================
 */

export const productsRelations = relations(
    productsTable,
    ({ one, many }) => ({
        /**
         * ----------------------------------------------------------
         * Store
         * ----------------------------------------------------------
         */

        store: one(sellerStore, {
            fields: [productsTable.storeId],
            references: [sellerStore.sellerId],
        }),

        /**
         * ----------------------------------------------------------
         * Category
         * ----------------------------------------------------------
         */

        category: one(categoriesTable, {
            fields: [productsTable.categoryId],
            references: [categoriesTable.id],
        }),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdBySeller: one(seller, {
            fields: [productsTable.createdBy],
            references: [seller.id],
            relationName: "product_created_by",
        }),

        updatedBySeller: one(seller, {
            fields: [productsTable.updatedBy],
            references: [seller.id],
            relationName: "product_updated_by",
        }),

        images: many(productImagesTable),
        videos: many(productVideosTable),
        variants: many(productVariantsTable),
        options: many(productVariantOptionsTable),
        attributeValues: many(productAttributeValuesTable),
        seo: one(productSeoTable),
        tagMappings: many(productTagMappingsTable),
        ai: one(productAiTable),

        /**
         * ----------------------------------------------------------
         * Future Relations
         * ----------------------------------------------------------
         *
         * The following relations will be added when their
         * respective modules are implemented.
         *
         * - product-images
         * - product-videos
         * - product-variants
         * - product-variant-options
         * - product-attribute-values
         * - pricing
         * - inventory
         * - shipping
         * - product-seo
         * - product-tags
         * - product-tag-mappings
         * - product-documents
         * - product-ai
         */
    }),
);