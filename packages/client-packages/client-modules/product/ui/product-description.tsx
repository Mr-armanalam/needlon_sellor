import { Separator } from "@/components/ui/separator";
import {
  fetchWishlist,
  initializeGuestWishlist,
} from "@/features/wishlist-slice";
import { useAppDispatch } from "@/store/store";
import { DetailedProductResponse, individualProduct } from "@/types/product";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import ProductDescriptionHeading from "../components/product-description-heading";
import ProductDescriptionCat from "../components/product-description-cat";
import ProductDescriptionEvent from "../components/product-description-event";

const ProductDescriptionn = ({
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
    <div className="md:absolute max-md:hidden p-6 md:top-16 border dark:bg-black dark:border-gray-600 border-stone-100 md:bottom-16 rounded-sm md:right-10 md:left-123 bg-stone-50">
      <ProductDescriptionHeading
        productItem={productData}
        CatType={productData?.category?.CatType!}
        SubCatType={productData.category?.SubCatType!}
        contentTag={productData.category?.contentTag!}
        userId={userId}
        dispatch={dispatch}
      />
      <Separator className="mt-5 " />

      <ProductDescriptionCat productItem={productData} />

      <ProductDescriptionEvent
        productItem={productData}
        dispatch={dispatch}
        userId={userId}
      />
    </div>
  );
};

export default ProductDescriptionn;
