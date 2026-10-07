'use client'
import { Button } from "@/components/ui/button";
import { fetchCart, removeFromCart } from "@/features/cart-slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { TiShoppingCart } from "react-icons/ti";



const CheckoutPrompt = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {data: session} = useSession();
  const router = useRouter();
  const cart = useAppSelector((state) => state.cart.cart);
  const dispatch = useAppDispatch()

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  useEffect(() => {
    dispatch(fetchCart(session?.user.id ?? ''));
  }, [dispatch, session]);
  

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white dark:bg-black dark:border-l shadow-lg p-4 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h2 className="font-bold font-garamond">CART ITEMS - {cart.length} </h2>
        <button className="cursor-pointer" onClick={() => setOpen(false)}>
          ✕
        </button>
      </div>

      <div className="mt-4 max-h-[68vh] font-garamond no-scrollbar overflow-y-auto space-y-4">
        {cart.map((item) => (
          <div
            key={`${item.id}-${item.size}`}
            className="flex border-y border-stone-300 bg-[#EAEAEA] dark:border-gray-800 dark:bg-white/6 p-8 gap-3 pb-2"
          >
            <div className="relative w-15 h-25">
              <Image
                fill
                src={item.image}
                alt={item.name}
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-muted-foreground">
                ${Number(item.price)?.toFixed(2)} × {item.quantity}
              </p>
              <p className="text-sm mt-2">Size: {item.size}</p>
              <p className="text-sm">Quantity: {item.quantity}</p>
              <button
                className="text-red-500 cursor-pointer text-xs mt-1"
                onClick={() =>
                  dispatch(
                    removeFromCart({
                      userId: session?.user.id,
                      productId: item.productId ?? '',
                      size: item.size,
                    })
                  )
                }
              >
                Remove one
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4">
        <p className="flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </p>
        <Button onClick={() => router.push('/cart')} size={'lg'} className=" w-full cursor-pointer mt-4 dark:bg-yellow-700 dark:border dark:border-gray-800 dark:text-white rounded-xs py-4">
         <TiShoppingCart/> Proceed with cart 
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPrompt;
