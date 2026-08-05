import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as usersTable from './schema/users';
import * as passwordResetToken from './schema/password-reset-tokens';
import * as sellers from './schema/seller';
import { sellerSettings } from './schema/seller/seller-setting';
import {sellerAddresses} from "@/db/schema/seller/seller-address";
import {sellerProfiles} from "@/db/schema/seller/seller-profile";
import {sellerStore} from "@/db/schema/seller/seller-store";
import {sellerDocuments} from "@/db/schema/seller/seller-document";
import {sellerBankAccounts} from "@/db/schema/seller/seller-bank-account";
import {sellerVerification} from "@/db/schema/seller/seller-verification";
import { productsRelations, productsTable } from "@/db/schema/catalog/products";
import { productVariantsTable } from "@/db/schema/catalog/products/product-variants";
import { productVariantsRelations } from "@/db/schema/catalog/products/product-variants/relations";
import {categoriesRelations, categoriesTable} from "@/db/schema/catalog/categories";
import {categoryAttributeOptionsTable} from "@/db/schema/catalog/category-attribute-options";
import {categoryAttributesTable} from "@/db/schema/catalog/category-attributes";
import {inventoryTable} from "@/db/schema/catalog/products/inventory/table";
import {pricingTable} from "@/db/schema/catalog/products/pricing";
import {productAiTable} from "@/db/schema/catalog/products/product-ai";
import {productAttributeValuesTable} from "@/db/schema/catalog/products/product-attribute-values";
import {productImagesTable} from "@/db/schema/catalog/products/product-images";
import {productSeoTable} from "@/db/schema/catalog/products/product-seo";
import {productTagMappingsTable} from "@/db/schema/catalog/products/product-tag-mappings";
import {productTagsTable} from "@/db/schema/catalog/products/product-tags";
import {productVariantOptionsTable} from "@/db/schema/catalog/products/product-variant-options";
import {productVideosTable} from "@/db/schema/catalog/products/product-videos";
import {shippingTable} from "@/db/schema/catalog/products/shipping";
import * as ordersSchema from "./schema/orders";


export const schema = {
  ...ordersSchema,
  users: usersTable.usersTable,
  passwordResetToken: passwordResetToken.passwordResetTokens,
  sellers: sellers.seller,
  sellerSession: sellers.sessions,
  sellerPasswordResetToken: sellers.sellerpasswordResetTokens,

  seller_settings: sellerSettings,
  sellerAddresses: sellerAddresses,
  sellerProfiles: sellerProfiles,
  sellerStore: sellerStore,
  sellerDocuments: sellerDocuments,
  sellerBankAccounts: sellerBankAccounts,
  sellerVerification: sellerVerification,
  categoriesTable: categoriesTable,
  categories: categoriesTable,
  categoryRelations: categoriesRelations,
  productsTable: productsTable,
  productsRelations: productsRelations,
  categoryAttributeOptionsTable,
  categoryAttributesTable,
  inventoryTable,
  pricingTable,
  productAiTable,
  productAttributeValuesTable,
  productImagesTable,
  productSeoTable,
  productTagMappingsTable,
  productTagsTable,
  productVariantOptionsTable,
  productVariantsTable,
  productVariantsRelations,
  productVideosTable,
  shippingTable
};

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
