import { Button } from "@/components/ui/button";
import { addToCart, fetchCart } from "@/features/cart-slice";
import { useAppSelector } from "@/store/store";
import { DetailedProductResponse } from "@/types/product";


const ProductDescriptionEvent = ({dispatch, userId, productItem}:{dispatch: any, userId?: string, productItem: DetailedProductResponse}) => {
    const { cart } = useAppSelector((state) => state.cart);

   const handleAddToCart = (product: DetailedProductResponse, size: string) => {
    dispatch(
      addToCart({
        userId,
        product: { ...product, size, quantity: 1, updatedAt: new Date(product.updatedAt) },
        size,
      }),
    );
    dispatch(fetchCart(userId?? ""));
  };

    const selectedSize = productItem?.sizes?.at(0) ?? "S";

    const isAlreadyInCart = cart.some(
    (item) =>
      item.productId === productItem.id &&
      item.size === selectedSize,
  );
  return (
    <div className="mt-8 w-full flex gap-x-12 ">
      <Button
        type="button"
        className="h-12 w-60 cursor-pointer dark:bg-white/10 dark:text-white dark:border bg-stone-800 rounded-full"
      >
        Customize
      </Button>
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
