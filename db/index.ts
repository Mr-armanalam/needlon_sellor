import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as cartItems from './schema/cart-items';
import * as coupons from './schema/coupons';
import * as orders from './schema/orders';
import * as productItems from './schema/product-items';
import * as userAddress from './schema/user-address';
import * as usersTable from './schema/users';
import * as wishListItems from './schema/wishlist-items';
import * as passwordResetToken from './schema/password-reset-tokens';
import * as sellers from './schema/seller';
import { sellerSettings } from './schema/seller/seller-setting';
import {sellerAddresses} from "@/db/schema/seller/seller-address";
import {sellerProfiles} from "@/db/schema/seller/seller-profile";
import {sellerStore} from "@/db/schema/seller/seller-store";
import {sellerDocuments} from "@/db/schema/seller/seller-document";
import {sellerBankAccounts} from "@/db/schema/seller/seller-bank-account";
import {sellerVerification} from "@/db/schema/seller/seller-verification";
import {categories} from "@/db/schema/catalog/category/table";

export const schema = {
  cartItems: cartItems.cartItems,
  coupons: coupons.coupons,
  orders: orders.orders,
  productItems: productItems.productItems,
  userAddress: userAddress.userAddress,
  users: usersTable.usersTable,
  wishlistItems: wishListItems.wishListItems,
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
  categories: categories
};

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
