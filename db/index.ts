// import { drizzle } from 'drizzle-orm/postgres-js'

//   export const db = drizzle(process.env.DATABASE_URL!);

// db/index.ts
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

export const schema = {
  cartItems: cartItems.cartItems,
  coupons: coupons.coupons,
  orders: orders.orders,
  productItems: productItems.productItems,
  userAddress: userAddress.userAddress,
  users: usersTable.usersTable,
  wishlistItems: wishListItems.wishListItems,
  passwordResetToken: passwordResetToken.passwordResetTokens,
};

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });
