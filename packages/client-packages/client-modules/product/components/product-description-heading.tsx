import { toggleGuestWishlist, toggleWishlist } from "@/features/wishlist-slice";
import { useAppSelector } from "@/store/store";
import { DetailedProductResponse, productDataType } from "@/types/product";
import { Heart, Share2Icon } from "lucide-react";
import { usePathname } from "next/navigation";

const ProductDescriptionHeading = ({
  productItem,
  userId,
  dispatch,
  CatType,
  SubCatType,
  contentTag,
}: {
  productItem: DetailedProductResponse;
  CatType: string;
  SubCatType: string;
  userId?: string;
  dispatch: any;
  contentTag?: string;
}) => {
  const { wishlist, guestWishlist, loading } = useAppSelector(
    (state) => state.wishlist,
  );

  const pathname = usePathname();
  const url = `${process.env.NEXT_PUBLIC_URL}${pathname}`;

  const wishlistItems = wishlist.length > 0 ? wishlist : guestWishlist;

  const handleShare = async () => {
    // 1. Check if the browser supports the API
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: productItem.name,
          text:contentTag!,
          url: url,
        });
        console.log("Content shared successfully");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      // 2. Fallback logic (e.g., copy to clipboard)
      alert("Web Share API not supported. Copying link instead.");
      navigator.clipboard.writeText(url);
    }
  };

  const handleToggleWishlist = (
    productId: string,
    image: string,
    price: number,
    name: string,
    size?: string,
  ) => {
    if (userId) {      
      const exists = wishlist.some(
        (item) => item.productId === productId && item.size === size,
      );
      dispatch(toggleWishlist({ userId, productId, size, exists }));
    } else {
      dispatch(
        toggleGuestWishlist({
          productId: productId,
          name,
          price: Number(price),
          image: image,
          size: size,
        }),
      );
    }
  };
  return (
    <>
      <span className="font-garamond text-sm font-semibold dark:bg-white/10 bg-stone-200 px-4 rounded-md py-2">{`${(CatType ?? "").charAt(0).toUpperCase() + (CatType ?? "").slice(1)}'s ${(SubCatType ?? "").toLowerCase()}`}</span>

      <div className="flex gap-4 justify-between">
        <h1 className="font-garamond mt-6 max-md:font-semibold max-md:text-4xl md:text-5xl">{productItem.name}</h1>
        <div className="flex gap-4 mt-auto bg-stone-200 text-black py-2 px-4 rounded-full">
          <Share2Icon
            onClick={handleShare}
            className="cursor-pointer"
            size={20}
          />
          <div className="w-px bg-black" />
          <Heart
            onClick={() =>
              handleToggleWishlist(
                productItem.id,
                productItem.image,
                Number(productItem.price),
                productItem.name,
                productItem.sizes?.at(0),
              )
            }
            size={20}
            className={`cursor-pointer ${
              wishlistItems?.some((w) => w.productId === productItem.id)
                ? "fill-black"
                : ""
            }`}
          />
        </div>
      </div>
    </>
  );
};

export default ProductDescriptionHeading;
