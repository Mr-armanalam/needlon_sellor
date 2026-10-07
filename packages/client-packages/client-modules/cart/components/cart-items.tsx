"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchCart, removeFromCart } from "@/features/cart-slice";
import { toggleWishlist } from "@/features/wishlist-slice";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { format } from "date-fns";
import { Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type cartItemProps = {
  productId?: string;
  image: string;
  name: string;
  size: string;
  price: number;
  updatedAt?: Date;
};

const CartItems = ({
  productId = "",
  image,
  name = "Beautiful Luxury Pants",
  size = "s",
  price,
  updatedAt = new Date(),
}: cartItemProps) => {
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();

  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  return (
    <div
      className={`border-y overflow-y-scroll no-scrollbar gap-x-6 xl:gap-x-8 dark:border-stone-900 border-stone-200 mb-1.5 flex`}
    >
      <Link
        href={`/product/${productId}`}
        className="relative w-32 h-40 xl:w-45 xl:h-45"
      >
        <Image src={image ?? ""} fill alt="wishlist " />
      </Link>
      <div className="my-4 relative flex-1 dark:text-white/90 text-stone-800">
        <h1 className="font-semibold max-sm:line-clamp-1">{name}</h1>
        <p className="text-sm pl-0.5 lowercase dark:text-white/70 text-stone-600">Size: {size}</p>
        <h2 className="text-2xl font-semibold mt-1 xl:my-2">₹{price}</h2>
        <p className="absolute bottom-0 xl:right-4 text-stone-500 text-xs ">
          Item added {format(updatedAt, "dd MMMM yyyy")}
        </p>
        <div className="flex max-sm:items-center gap-x-3">
          <Button
            disabled={!!wishlist.find((item) => item.productId === productId)}
            variant={isMobile? 'link': 'default'}
            onClick={() =>
              dispatch(
                toggleWishlist({
                  userId: userId ?? "",
                  productId,
                  size: size,
                  exists: !!wishlist.find(
                    (item) => item.productId === productId,
                  ),
                }),
              )
            }
            className="xl:text-xs max-sm:px-0 cursor-pointer rounded-full xl:mt-3"
          >
            Save for later
          </Button>
          {isMobile && <div className="bg-black flex h-4 w-px" />}
          <Button
            onClick={() => {
              dispatch(removeFromCart({ userId, productId, size }));
              if (userId) dispatch(fetchCart(userId));
              router.refresh();
            }}
            variant={isMobile ? 'link':"outline"}
            className="xl:text-xs max-sm:px-0 cursor-pointer rounded-full xl:mt-3"
          >
           {isMobile ? 'Remove' : <Trash2Icon />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
