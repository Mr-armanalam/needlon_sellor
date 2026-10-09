import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as usersTable from './schema/users';
import * as passwordResetToken from './schema/password-reset-tokens';
import * as sellers from './schema/seller';
import { sellerSettings } from './schema/seller/seller-setting';
import {sellerAddresses} from "./schema/seller/seller-address";
import {sellerProfiles} from "./schema/seller/seller-profile";
import {sellerStore} from "./schema/seller/seller-store";
import {sellerDocuments} from "./schema/seller/seller-document";
import {sellerBankAccounts} from "./schema/seller/seller-bank-account";
import {sellerPayoutRequests} from "./schema/seller/seller-payout-request";
import {sellerVerification} from "./schema/seller/seller-verification";
import {subscriptionPlans} from "./schema/subscription/sucbscription-plan";
import {sellerSubscriptions} from "./schema/subscription/seller-subscription";
import {subscriptionPlanFeatures} from "./schema/subscription/subscription-plan-features";
import {subscriptionPayments} from "./schema/subscription/subscription-payment";
import {subscriptionInvoices} from "./schema/subscription/subscription-invoice";
import { productsRelations, productsTable } from "./schema/catalog/products";
import { productVariantsTable } from "./schema/catalog/products/product-variants";
import { productVariantsRelations } from "./schema/catalog/products/product-variants/relations";
import {categoriesRelations, categoriesTable} from "./schema/catalog/categories";
import {categoryAttributeOptionsTable} from "./schema/catalog/category-attribute-options";
import {categoryAttributesTable} from "./schema/catalog/category-attributes";
import {inventoryTable} from "./schema/catalog/products/inventory/table";
import {pricingTable} from "./schema/catalog/products/pricing";
import {productAiTable} from "./schema/catalog/products/product-ai";
import {productAttributeValuesTable} from "./schema/catalog/products/product-attribute-values";
import {productImagesTable} from "./schema/catalog/products/product-images";
import {productSeoTable} from "./schema/catalog/products/product-seo";
import {productTagMappingsTable} from "./schema/catalog/products/product-tag-mappings";
import {productTagsTable} from "./schema/catalog/products/product-tags";
import {productVariantOptionsTable} from "./schema/catalog/products/product-variant-options";
import {productVideosTable} from "./schema/catalog/products/product-videos";
import { shippingTable } from "./schema/catalog/products/shipping";
import * as ordersSchema from "./schema/orders";
import { reviewsTable } from "./schema/reviews";
import * as helpSchema from "./schema/help";
import * as feedbackSchema from "./schema/feedback";
import * as clientSchema from "./schema/client";

export const schema = {
  ...ordersSchema,
  ...helpSchema,
  ...feedbackSchema,
  ...clientSchema,
  reviewsTable: reviewsTable,
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
  sellerPayoutRequests: sellerPayoutRequests,
  sellerVerification: sellerVerification,
  subscriptionPlans: subscriptionPlans,
  sellerSubscriptions: sellerSubscriptions,
  subscriptionPlanFeatures: subscriptionPlanFeatures,
  subscriptionPayments: subscriptionPayments,
  subscriptionInvoices: subscriptionInvoices,
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
