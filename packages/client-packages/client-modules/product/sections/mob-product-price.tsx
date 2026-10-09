"use client";
import { DetailedProductResponse } from "@/types/product";
import React, { useEffect } from "react";
import ProductDescriptionHeading from "../components/product-description-heading";
import {
  fetchWishlist,
  initializeGuestWishlist,
} from "@/features/wishlist-slice";
import { useAppDispatch } from "@/store/store";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";

const MobProductPrice = ({
  productData,
}: {
  productData: DetailedProductResponse;
}) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const userId = session?.user.id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlist(userId));
    } else {
      const local = localStorage.getItem("wishlist"); // Load from localStorage for guests
      if (local) {
        dispatch(initializeGuestWishlist());
      }
    }
  }, [userId, dispatch]);

  return (
    <div className="md:hidden mt-4">
      <ProductDescriptionHeading
        productItem={productData}
        CatType={productData?.category?.CatType!}
        SubCatType={productData.category?.SubCatType!}
        contentTag={productData.category?.contentTag!}
        userId={userId}
        dispatch={dispatch}
      />

      <Separator className="mt-5 " />
    </div>
  );
};

export default MobProductPrice;
