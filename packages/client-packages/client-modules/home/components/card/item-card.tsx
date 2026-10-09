"use client";

import {
  fetchWishlist,
  initializeGuestWishlist,
  toggleGuestWishlist,
  toggleWishlist,
} from "@/features/wishlist-slice";
import RatingDisplay from "@/modules/shared/rating/ratingDisplay";
/*

 > navigate the listed product to '/product/id'
 > showcasing the short product details, averagerating, review count, name, price, tagname, size, images
 > TO DO: to add color name and circle indicator

*/

import { useAppDispatch, useAppSelector } from "@/store/store";
import { ClientProductItem } from "@/types/product";
import { StarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductCardPreview({
  item,
}: {
  item: ClientProductItem;
}) {
  const { id, name, price, image, modalImage, sizes } = item;
  const { wishlist, guestWishlist, loading } = useAppSelector(
    (state) => state.wishlist,
  );

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user.id;

  const wishlistItems = wishlist.length > 0 ? wishlist : guestWishlist;

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;

    if (x < width / 2) {
      setHoverSide("left");
    } else {
      setHoverSide("right");
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

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlist(userId));
    } else {
      // Load from localStorage for guests
      const local = localStorage.getItem("wishlist");
      if (local) {
        dispatch(initializeGuestWishlist());
      }
    }
  }, [userId, dispatch]);

  return (
    <div key={id} className="cursor-pointer ">
      <div
        onMouseEnter={() => setHoveredId(id)}
        onMouseLeave={() => {
          setHoveredId(null);
          setHoverSide(null);
        }}
        onMouseMove={handleMouseMove}
        className="bg-[#EAEAEA] group relative xl:w-70 "
      >
        <div
          onClick={() => router.push(`/product/${id}`)}
          className="xl:aspect-11/16 max-sm:h-70 w-full relative "
        >
          <Image
            src={
              hoveredId
                ? hoverSide === "left"
                  ? (modalImage?.[0] ?? image ?? "/placeholder.png")
                  : (modalImage?.[1] ?? image ?? "/placeholder.png")
                : (image ?? "/placeholder.png")
            }
            alt={name}
            fill
            className="object-fill "
          />
        </div>

        <button
          onClick={() =>
            handleToggleWishlist(id, image!, Number(price), name, sizes?.at(0))
          }
          aria-label="Toggle wishlist"
          className={`hidden group-hover:flex absolute right-6 top-6 text-white rounded-full hover:bg-black p-2 ${
            wishlistItems?.some((w) => w.productId === id)
              ? "bg-black"
              : "bg-zinc-400"
          }`}
        >
          <StarIcon
            size={16}
            className={
              wishlistItems.some((w) => w.productId === id)
                ? "fill-orange-400 text-orange-400"
                : ""
            }
          />
        </button>
      </div>
      <p className="mt-2 px-1 xl:text-xl text-sm text-zinc-600 dark:text-gray-100 font-garamond">
        {name}
      </p>
      <div className="flex-1 ml-2 mt-1">
        <div className="text-[10px] text-gray-600">
          <div className="flex gap-x-1 items-center font-semibold">
            <span className="mb-px">{item.averageRating}</span>
            <RatingDisplay
              color="#4a5565 "
              size={9}
              avgRating={item.averageRating}
            />
            / 5
          </div>
          <div className="text-[9px] text-gray-400">
            {item.reviewCount} reviews
          </div>
        </div>
      </div>
    </div>
  );
}
