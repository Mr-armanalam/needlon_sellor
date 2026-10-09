import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { WishlistItemSkeleton } from "./wishlist_skeleton";

const loading = () => {
  return <WishlistItemSkeleton />;
};

export default loading;
