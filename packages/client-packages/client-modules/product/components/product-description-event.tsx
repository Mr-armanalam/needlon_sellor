import { Button } from "@/components/ui/button";
import { addToCart, fetchCart } from "@/features/cart-slice";
import { useAppSelector } from "@/store/store";
import { DetailedProductResponse } from "@/types/product";


import { useRouter } from "next/navigation";

const ProductDescriptionEvent = ({dispatch, userId, productItem}:{dispatch: any, userId?: string, productItem: DetailedProductResponse}) => {
    const router = useRouter();
    const { cart } = useAppSelector((state) => state.cart);

   const handleAddToCart = async (product: DetailedProductResponse, size: string) => {
    await dispatch(
      addToCart({
        userId,
        product: { ...product, size, quantity: 1, updatedAt: new Date(product.updatedAt) },
        size,
      }),
    );
  };

    const selectedSize = productItem?.sizes?.at(0) ?? "S";

    const isCustomizable = productItem?.isCustomizable !== false;

    const isAlreadyInCart = (Array.isArray(cart) ? cart : []).some(
    (item) =>
      item.productId === productItem.id &&
      item.size === selectedSize,
  );
  return (
    <div className="mt-8 w-full flex gap-x-12 ">
      {isCustomizable ? (
        <Button
          type="button"
          onClick={() => router.push(`/product/${productItem.id}/customize`)}
          className="h-12 w-60 cursor-pointer dark:bg-white/10 dark:text-white dark:border bg-stone-800 rounded-full hover:bg-stone-900 transition shadow-sm"
        >
          Customize
        </Button>
      ) : (
        <Button
          type="button"
          disabled
          title="Pre-sewn Ready-to-Wear: Customization is not offered for this item"
          className="h-12 w-60 cursor-not-allowed opacity-50 dark:bg-white/5 dark:text-stone-400 bg-stone-200 text-stone-500 rounded-full"
        >
          Standard Sizing Only
        </Button>
      )}
      <Button
        onClick={() =>
          handleAddToCart(
            productItem,
            productItem?.sizes?.at(0) ?? "S",
          )
        }
        disabled={isAlreadyInCart}
        type="button"
        className={`h-12 w-60 cursor-pointer ${isAlreadyInCart && "opacity-50"} dark:bg-white/6 dark:border dark:text-white bg-stone-700 rounded-full`}
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductDescriptionEvent;
