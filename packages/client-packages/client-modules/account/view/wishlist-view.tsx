"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { HeartOff, Trash2Icon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addToCart } from "@/features/cart-slice";
import {
  fetchWishlist,
  syncWishlistWithDB,
  initializeGuestWishlist,
  toggleGuestWishlist,
  toggleWishlist,
} from "@/features/wishlist-slice";
import NoUserAddress from "../shared/no-user-address";
import { WishlistItemSkeleton } from "@/app/(root)/(account)/account/wishlist/wishlist_skeleton";
import { WishlistItem } from "@/types/wishlist";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  userId?: string;
}

const normalizeItem = (item: any): WishlistItem => ({
  id: item.id ?? "",
  productId: item.productId ?? item.product_id ?? "",
  name: item.name ?? "Unknown Product",
  price: item.price ?? 0,
  quantity:
    typeof item.quantity === "number"
      ? item.quantity
      : Number(item.quantity) || 0,
  size: item.size ?? "s",
  image: item.image ?? null,
  updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
});

const WishlistView = ({ userId }: Props) => {
  const dispatch = useAppDispatch();
   const isMobile = useIsMobile();
  const { wishlist, guestWishlist, loading } = useAppSelector(
    (state) => state.wishlist,
  );
  const { cart } = useAppSelector((state) => state.cart);

  //  Data Merging
  const displayList = useMemo(() => {
    const sourceList = userId ? wishlist : guestWishlist;
    return (sourceList || []).map(normalizeItem);
  }, [userId, wishlist, guestWishlist]);

  // Initialization & Sync 
  useEffect(() => {
    // load guest items from localStorage on mount
    dispatch(initializeGuestWishlist());

    if (userId) {
      if (guestWishlist.length > 0) {
        dispatch(syncWishlistWithDB({ userId, guestItems: guestWishlist }));
      } else {
        dispatch(fetchWishlist(userId));
      }
    }
  }, [userId, dispatch, guestWishlist.length]);

  const handleToggleWishlist = (item: WishlistItem) => {
    if (userId) {
      dispatch(
        toggleWishlist({
          userId,
          productId: item.productId,
          size: item.size,
          exists: true,
        }),
      );
    } else {
      dispatch(
        toggleGuestWishlist({
          productId: item.productId,
          name: item.name,
          price: Number(item.price),
          image: item.image ?? "",
          size: item.size,
        }),
      );
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    dispatch(
      addToCart({
        userId,
        product: {
          ...item,
          id: item.productId,
          price: Number(item.price) || 0,
          image: item.image ?? "",
        },
        size: item.size ?? "s",
      }),
    );
  };

  if (displayList.length === 0) return <WishlistItemSkeleton />;

  return (
    <div className="px-3">
      <header className="pb-7">
        <h1 className="font-semibold text-2xl font-garamond">
          Wishlist Items ({displayList.length})
        </h1>
      </header>

      {displayList.length === 0 ? (
        <div className="text-center text-stone-500 mt-10">
          <NoUserAddress Icon={HeartOff} description="Your wishlist is empty" />
        </div>
      ) : (
        <div className="flex flex-col">
          {displayList.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="border-y gap-x-6 lg:gap-x-8 border-stone-200 dark:border-stone-900 mb-1.5 flex overflow-hidden"
            >
              {/* Product Image */}
              <Link
                href={`/product/${item.productId}`}
                className="relative w-32 h-40 lg:w-45 lg:h-45 lg:shrink-0"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    fill
                    className="object-cover"
                    alt={item.name}
                  />
                ) : (
                  <div className="bg-gray-100 dark:bg-white/2 w-full h-full flex items-center justify-center text-stone-400">
                    No Image
                  </div>
                )}
              </Link>

              {/* Product Details */}
              <div className="my-4 flex-1 text-stone-800 dark:text-white/90 relative">
                <h2 className="font-semibold max-sm:text-lg max-sm:line-clamp-1 lg:text-lg">{item.name}</h2>
                <p className="text-sm lowercase dark:text-white/70 text-stone-600">
                  Size: {item.size}
                </p>
                <p className="text-2xl font-bold mt-1 lg:my-2">₹{item.price}</p>

                <div className="flex max-sm:items-center lg:gap-x-3 lg:mt-4">
                  <Button
                    disabled={
                      !!cart.find(
                        (cartItem) => cartItem.productId === item.productId,
                      )
                    }
                    variant={isMobile? 'link': 'default'}
                    onClick={() => handleAddToCart(item)}
                    className="rounded-full max-sm:px-0 max-sm:mr-2 lg:px-6"
                  >
                    Add to Cart
                  </Button>
                  {isMobile && <div className="bg-black flex h-4 w-px" />}
                  <Button
                    onClick={() => handleToggleWishlist(item)}
                    variant={isMobile ? 'link':"outline"}
                    className="rounded-full aspect-square p-2"
                  >
                   {isMobile ? 'Remove' : <Trash2Icon className="w-4 h-4" />}
                  </Button>
                </div>

                <time className="absolute bottom-0 right-0 text-[10px] text-stone-400 italic">
                  Added {format(item.updatedAt, "dd MMM yyyy")}
                </time>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistView;

// "use client";

// import { useEffect, useMemo } from "react";
// import Image from "next/image";
// import { format } from "date-fns";
// import { Button } from "@/components/ui/button";
// import { HeartOff, Trash2Icon } from "lucide-react";
// import { useAppDispatch, useAppSelector } from "@/store/store";
// import { addToCart } from "@/features/cart-slice";
// import {
//   fetchWishlist,
//   setGuestWishlist,
//   toggleGuestWishlist,
//   toggleWishlist,
//   WishlistItem,
// } from "@/features/wishlist-slice";
// import NoUserAddress from "../shared/no-user-address";
// import { WishlistItemSkeleton } from "@/app/(root)/(account)/account/wishlist/wishlist_skeleton";

// interface Props {
//   userId?: string;
// }

// const normalizeItem = (item: any): WishlistItem => ({
//   id: item.id ?? "",
//   productId: item.productId ?? item.product_id ?? "",
//   name: item.name ?? "Unknown Product",
//   price: String(item.price ?? "0"),
//   quantity: typeof item.quantity === "number" ? item.quantity : Number(item.quantity) || 0,
//   size: item.size ?? "s",
//   image: item.image ?? null,
//   updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
// });

// const WishlistView = ({ userId }: Props) => {
//   const dispatch = useAppDispatch();
//   const { wishlist, guestWishlist, loading } = useAppSelector((state) => state.wishlist);

//   const displayList = useMemo(() => {
//     const sourceList = userId ? wishlist : guestWishlist;
//     return (sourceList || []).map(normalizeItem);
//   }, [userId, wishlist, guestWishlist]);

//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchWishlist(userId));
//     }
//   }, [userId, dispatch]);

//   useEffect(() => {
//     if (userId) return;

//     const raw = localStorage.getItem("wishlist");
//     if (raw) {
//       try {
//         const parsed = JSON.parse(raw);
//         dispatch(setGuestWishlist(parsed));
//       } catch (e) {
//         console.error("Failed to parse wishlist", e);
//       }
//     }
//   }, [userId, dispatch]);

//   useEffect(() => {
//     if (!userId && guestWishlist) {
//       localStorage.setItem("wishlist", JSON.stringify(guestWishlist));
//     }
//   }, [guestWishlist, userId]);

//   const handleToggleWishlist = (item: WishlistItem) => {
//     if (userId) {
//       dispatch(toggleWishlist({
//         userId,
//         productId: item.productId,
//         size: item.size,
//         exists: true
//       }));
//     } else {
//       dispatch(toggleGuestWishlist({
//         productId: item.productId,
//         name: item.name,
//         price: Number(item.price),
//         image: item.image ?? "",
//         size: item.size,
//       }));
//     }
//   };

//   const handleAddToCart = (item: WishlistItem) => {
//     dispatch(addToCart({
//       userId,
//       product: {
//         ...item,
//         id: item.productId,
//         price: Number(item.price) || 0,
//         image: item.image ?? "",
//       },
//       size: item.size ?? "s",
//     }));
//   };

//   if (loading && userId && displayList.length === 0) {
//     return <WishlistItemSkeleton />;
//   }

//   return (
//     <div className="px-3">
//       <h1 className="font-semibold text-2xl font-garamond pb-7">
//         Wishlist Items ({displayList.length})
//       </h1>

//       {displayList.length === 0 ? (
//         <div className="text-center text-stone-500 mt-10">
//           <NoUserAddress Icon={HeartOff} description="No any wishlist items" />
//         </div>
//       ) : (
//         displayList.map((item) => (
//           <div
//             key={`${item.productId}-${item.size}`}
//             className="border-y gap-x-8 border-stone-200 mb-1.5 flex overflow-hidden"
//           >
//             <div className="relative w-[180px] h-[180px]">
//               {item.image ? (
//                 <Image src={item.image} fill className="object-cover" alt={item.name} />
//               ) : (
//                 <div className="bg-gray-200 w-full h-full flex items-center justify-center text-stone-400">
//                   No Image
//                 </div>
//               )}
//             </div>

//             <div className="my-4 flex-1 text-stone-800 relative">
//               <h1 className="font-semibold">{item.name}</h1>
//               <p className="text-sm lowercase text-stone-600 mt-1">Size: {item.size}</p>
//               <h2 className="text-2xl font-semibold my-2">₹{item.price}</h2>
//               <p className="absolute bottom-0 right-4 text-xs text-stone-500">
//                 Added {format(item.updatedAt, "dd MMM yyyy")}
//               </p>

//               <div className="flex gap-x-3 mt-3">
//                 <Button
//                   onClick={() => handleAddToCart(item)}
//                   className="text-xs rounded-full"
//                 >
//                   Add to Cart
//                 </Button>
//                 <Button
//                   onClick={() => handleToggleWishlist(item)}
//                   variant="outline"
//                   className="text-xs rounded-full"
//                 >
//                   <Trash2Icon className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default WishlistView;

// // "use client";
// // import { useEffect, useState } from "react";
// // import Image from "next/image";
// // import { format } from "date-fns";
// // import { Button } from "@/components/ui/button";
// // import { HeartOff, Trash2Icon } from "lucide-react";
// // import { useAppDispatch, useAppSelector } from "@/store/store";
// // import { addToCart } from "@/features/cart-slice";
// // import {
// //   fetchWishlist,
// //   setGuestWishlist,
// //   toggleGuestWishlist,
// //   toggleWishlist,
// //   WishlistItem,
// // } from "@/features/wishlist-slice";
// // import NoUserAddress from "../shared/no-user-address";
// // import { WishlistItemSkeleton } from "@/app/(root)/(account)/account/wishlist/wishlist_skeleton";

// // interface Props {
// //   serverWishlist?: WishlistItem[];
// //   userId?: string;
// // }

// // const WishlistView = ({ serverWishlist = [], userId }: Props) => {
// //   const dispatch = useAppDispatch();

// //   const { wishlist, guestWishlist, loading } = useAppSelector(
// //     (state) => state.wishlist
// //   );

// //   const [localList, setLocalList] = useState<WishlistItem[]>(
// //     serverWishlist.map(normalizeItem)
// //   );

// //   function normalizeItem(item: any): WishlistItem {
// //     return {
// //       id: item.id ?? "",
// //       productId: item.productId ?? item.product_id ?? "",
// //       name: item.name ?? "Unknown Product",
// //       price: String(item.price ?? "0"),
// //       quantity:
// //         typeof item.quantity === "number"
// //           ? item.quantity
// //           : Number(item.quantity) || 0,
// //       size: item.size ?? "s",
// //       image: item.image ?? null,
// //       updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
// //     };
// //   }

// //   useEffect(() => {
// //     if (userId) {
// //       dispatch(fetchWishlist(userId));
// //     }
// //   }, [userId, dispatch]);

// //   useEffect(() => {
// //     if (userId) {
// //       if (Array.isArray(wishlist) && wishlist.length >= 0) {
// //         const normalized = wishlist.map(normalizeItem);
// //         setLocalList(normalized);
// //       }
// //     }
// //   }, [wishlist, userId]);

// //   useEffect(() => {
// //     if (!userId) {
// //       try {
// //         const raw = localStorage.getItem("wishlist");
// //         if (raw) {
// //           const parsed = JSON.parse(raw) as Array<any>;
// //           dispatch(setGuestWishlist(parsed));
// //           setLocalList(parsed.map(normalizeItem));
// //         } else {
// //           setLocalList([]);
// //         }
// //       } catch (e) {
// //         console.error("Failed to parse guest wishlist localStorage:", e);
// //       }
// //     }
// //   }, [userId, dispatch]);

// //   useEffect(() => {
// //     if (!userId) {
// //       try {
// //         localStorage.setItem("wishlist", JSON.stringify(guestWishlist || []));
// //         if (Array.isArray(guestWishlist)) {
// //           setLocalList(guestWishlist.map(normalizeItem));
// //         }
// //       } catch (e) {
// //         console.error("Failed to persist guest wishlist:", e);
// //       }
// //     }
// //   }, [guestWishlist, userId]);

// //   const listCount = localList.length;

// //   const handleToggleWishlist = (
// //     productId: string,
// //     size?: string,
// //     price?: string,
// //     image?: string,
// //     name?: string
// //   ) => {
// //     setLocalList((prev) =>
// //       prev.filter(
// //         (it) => !(it.productId === productId && it.size === (size ?? it.size))
// //       )
// //     );

// //     if (userId) {
// //       const exists = true;
// //       dispatch(toggleWishlist({ userId, productId, size, exists }));
// //     } else {
// //       dispatch(
// //         toggleGuestWishlist({
// //           productId: productId,
// //           name: name ?? "",
// //           price: Number(price),
// //           image: image ?? "",
// //           size: size,
// //         })
// //       );
// //     }
// //   };

// //   const handleAddToCart = (item: WishlistItem) => {
// //     dispatch(
// //       addToCart({
// //         userId,
// //         product: {
// //           ...item,
// //           id: item.productId,
// //           price: Number(item.price) || 0,
// //           size: item.size ?? "s",
// //           image: item.image ?? "",
// //         },
// //         size: item.size ?? "s",
// //       })
// //     );
// //   };

// //   const makeKey = (it: WishlistItem, idx: number) =>
// //     it.id || `${it.productId}-${it.size ?? "s"}-${idx}`;

// //   return (
// //     <div className="px-3">
// //       <h1 className="font-semibold text-2xl font-garamond pb-7">
// //         Wishlist Items ({listCount})
// //       </h1>

// //       {loading && userId && listCount === 0 && <WishlistItemSkeleton />}

// //       {!listCount && (
// //         <div className="text-center text-stone-500 mt-10">
// //           <NoUserAddress Icon={HeartOff} description="No any wishlist items" />
// //         </div>
// //       )}

// //       {listCount >0 && localList.map((item, index) => (
// //         <div
// //           key={makeKey(item, index)}
// //           className="border-y gap-x-8 border-stone-200 mb-1.5 flex overflow-hidden"
// //         >
// //           <div className="relative w-[180px] h-[180px]">
// //             {item.image ? (
// //               <Image src={item.image} fill alt={item.name || "wishlist-item"} />
// //             ) : (
// //               <div className="bg-gray-200 w-full h-full flex items-center justify-center text-stone-400">
// //                 No Image
// //               </div>
// //             )}
// //           </div>

// //           <div className="my-4 flex-1 text-stone-800 relative">
// //             <h1 className="font-semibold">{item.name}</h1>
// //             <p className="text-sm lowercase text-stone-600 mt-1">
// //               Size: {item.size}
// //             </p>
// //             <h2 className="text-2xl font-semibold my-2">₹{item.price}</h2>
// //             <p className="absolute bottom-0 right-4 text-xs text-stone-500">
// //               Added {format(new Date(item.updatedAt), "dd MMM yyyy")}
// //             </p>

// //             <div className="flex gap-x-3 mt-3">
// //               <Button
// //                 onClick={() => handleAddToCart(item)}
// //                 className="text-xs cursor-pointer rounded-full"
// //               >
// //                 Add to Cart
// //               </Button>
// //               <Button
// //                 onClick={() =>
// //                   handleToggleWishlist(
// //                     item.productId,
// //                     item.size,
// //                     item.price,
// //                     item.image,
// //                     item.price
// //                   )
// //                 }
// //                 variant="outline"
// //                 className="text-xs rounded-full"
// //               >
// //                 <Trash2Icon />
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default WishlistView;
