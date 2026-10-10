"use client";

/*
  > fetch cart, wishlist & notification unread count from redux store
*/

import { fetchCart } from "@/features/cart-slice";
import { fetchWishlist } from "@/features/wishlist-slice";
import {
  fetchNotifications,
  selectUnreadCount,
} from "@/features/notification-slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Bell, Heart, ShoppingBagIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

const CartAndWishList = () => {
  const { cart } = useAppSelector((state) => state.cart);
  const { wishlist, guestWishlist } = useAppSelector((state) => state.wishlist);
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const unreadCount = useAppSelector(selectUnreadCount);
  const wishlistItems = session?.user?.id ? wishlist : guestWishlist;
  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchCart(session?.user?.id ?? ""));
    dispatch(fetchWishlist(session?.user?.id ?? ""));
  }, [dispatch, session?.user?.id]);

  return (
    <div className="mr-20">
      <div className="flex items-center space-x-6">
        <Link
          href={`/account/wishlist`}
          className="relative flex cursor-pointer items-center space-x-2"
        >
          {wishlistCount > 0 && (
            <span className="absolute -top-2.5 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {wishlistCount}
            </span>
          )}
          <Heart className="w-4 h-4 hover:scale-110" />
        </Link>
        <Link href={"/cart"} className="relative cursor-pointer">
          {Array.isArray(cart) && cart.length !== 0 && (
            <span className="absolute -top-2.5 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {cart.length}
            </span>
          )}
          <ShoppingBagIcon className="w-4 h-4 hover:scale-110" />
        </Link>
        <Link
          href={"/account/updates"}
          className="flex cursor-pointer relative items-center space-x-2"
        >
          {unreadCount > 0 && (
            <span className="absolute -top-2.5 -right-4 bg-red-500 text-white text-xs rounded-full px-1">
              {unreadCount}
            </span>
          )}
          <Bell className="w-4 h-4 hover:scale-110" />
        </Link>
      </div>
    </div>
  );
};

export default CartAndWishList;
