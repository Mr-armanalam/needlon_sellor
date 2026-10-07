"use client";

import React, { useEffect } from "react";
import PriceDetails from "../ui/price-details";
import CartProduct from "../ui/cart-product";
import Link from "next/link";
import { useAppDispatch } from "@/store/store";
import { CartItem, fetchCart } from "@/features/cart-slice";
import { Address } from "@/types/address";

interface CartViewProps {
  cart: CartItem[];
  userId: string;
}

const CartView = ({ cart, userId }: CartViewProps) => {
  const [currentAddress, setCurrentAddress] = React.useState<Address>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId)); 
    }
  }, [userId, dispatch]);

  if (!cart || cart.length === 0) {
    return (
      <main className="bg-white dark:bg-black flex justify-between items-center mt-4 rounded-xs p-6 max-w-[70vw]">
        <div>
          <h1 className="font-garamond font-semibold dark:text-white text-gray-800 text-2xl">
            Your Needlon Cart is Empty
          </h1>
          <p className="text-muted-foreground">Add Items to it now.</p>
        </div>

        <Link
          href={"/"}
          className="cursor-pointer border rounded-md px-3.5 py-2 text-sm dark:text-white text-gray-700 font-semibold hover:bg-stone-100 border-stone-300"
        >
          Shop now
        </Link>
      </main>
    );
  }

  return (
    <main className="grid gap-4 my-6 xl:grid-cols-3">
      <div className="col-span-2 h-fit rounded shadow-sm">
        <CartProduct
          cart={cart}
          currentAddress={currentAddress}
          setCurrentAddress={setCurrentAddress}
        />
      </div>

      <div className="xl:col-span-1 max-sm:flex max-sm:ml-1 max-sm:w-85 xl:mx-2 h-fit rounded shadow-sm dark:bg-black bg-white">
        <PriceDetails
          currentAddressId={currentAddress?.id}
          userId={userId}
          cart={cart}
        />
      </div>
    </main>
  );
};

export default CartView;




// "use client";
// import React, { useEffect, useState } from "react";
// import PriceDetails from "../ui/price-details";
// import CartProduct from "../ui/cart-product";
// import Link from "next/link";
// import { useAppDispatch, useAppSelector } from "@/store/store";
// import { fetchCart } from "@/features/cart-slice";
// import { useSession } from "next-auth/react";
// import { Address } from "@/features/address-slice";

// const CartView = () => {
//   const { cart, loading } = useAppSelector((state) => state.cart);
//   const [currentAddress, setCurrentAddress] = useState<Address>();

//   const { data: session } = useSession();
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     dispatch(fetchCart(session?.user.id ?? ""));
//   }, [dispatch, session]);

//   return cart.length === 0 ? (
//     <main className="bg-white flex justify-between items-center mt-4 rounded-xs p-6 max-w-[70vw]">
//       <div>
//         <h1 className="font-garamond font-semibold text-gray-800 text-2xl">
//           Your Needlon Cart is Empty
//         </h1>
//         <p className="text-muted-foreground">Add Items to it now.</p>
//       </div>
//       <Link
//         href={"/"}
//         className="cursor-pointer border rounded-md px-3.5 py-2 text-sm text-gray-700 font-roboto-sans font-semibold shadow-xs hover:bg-stone-100 border-stone-300"
//       >
//         Shop now
//       </Link>
//     </main>
//   ) : (
//     <main className="grid gap-4 my-6 grid-cols-3">
//       <div className="col-span-2 rounded shadow-sm">
//         <CartProduct
//           cart={cart}
//           currentAddress={currentAddress}
//           setCurrentAddress={setCurrentAddress}
//         />
//       </div>
//       <div className="col-span-1 h-fit rounded shadow-sm bg-white">
//         <PriceDetails
//           currentAddressId={currentAddress?.id}
//           userId={session?.user.id ?? ""}
//           cart={cart}
//         />
//       </div>
//     </main>
//   );
// };

// export default CartView;
