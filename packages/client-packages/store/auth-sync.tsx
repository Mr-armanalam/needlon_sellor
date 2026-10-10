"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "./store";
import { fetchCart, initializeGuestCart, syncCartWithDB } from "../features/cart-slice";
import { fetchWishlist, initializeGuestWishlist, syncWishlistWithDB } from "../features/wishlist-slice";

export function AuthSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const hasSyncedRef = useRef<string | null>(null);

  useEffect(() => {
    // 1. Unauthenticated or loading: Load guest data from localStorage into Redux
    if (status === "unauthenticated" || !session?.user?.id) {
      dispatch(initializeGuestCart());
      dispatch(initializeGuestWishlist());
      return;
    }

    // 2. User is authenticated: Check for guest items to sync to database
    const userId = session.user.id;
    if (hasSyncedRef.current === userId) return;
    hasSyncedRef.current = userId;

    const syncUserLocalData = async () => {
      // Sync Cart
      if (typeof window !== "undefined") {
        const localCartRaw = localStorage.getItem("cart");
        if (localCartRaw) {
          try {
            const localCart = JSON.parse(localCartRaw);
            if (Array.isArray(localCart) && localCart.length > 0) {
              await dispatch(syncCartWithDB({ userId, guestItems: localCart }));
            }
          } catch {
            // ignore JSON error
          }
        }
      }

      // Sync Wishlist
      if (typeof window !== "undefined") {
        const localWishlistRaw = localStorage.getItem("wishlist");
        if (localWishlistRaw) {
          try {
            const localWishlist = JSON.parse(localWishlistRaw);
            if (Array.isArray(localWishlist) && localWishlist.length > 0) {
              await dispatch(syncWishlistWithDB({ userId, guestItems: localWishlist }));
            }
          } catch {
            // ignore JSON error
          }
        }
      }

      // Refresh latest persisted cart and wishlist from DB
      dispatch(fetchCart(userId));
      dispatch(fetchWishlist(userId));
    };

    syncUserLocalData();
  }, [session?.user?.id, status, dispatch]);

  return null;
}
