import React, { Activity, useEffect } from "react";
import CartItems from "../components/cart-items";
import { ChooseAddress } from "../components/choose-address";
import { CartItem } from "@/features/cart-slice";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "@/modules/account/server/api/address";
import { Address } from "@/types/address";

type props = {
  cart: CartItem[];
  currentAddress?: Address;
  setCurrentAddress: React.Dispatch<React.SetStateAction<Address | undefined>>;
};

const CartProduct = ({ cart, currentAddress, setCurrentAddress }: props) => {
  const { data: session } = useSession();
  const userId = session?.user.id ?? "";

  const { data: addresses = [], isLoading: loading } = useQuery({
    queryKey: ["addresses", userId],
    queryFn: () => getAddresses(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (!addresses.length) return;

    const savedId = localStorage.getItem("current-addr");
    const found = addresses.find((a) => a.id === savedId);

    setCurrentAddress(found ?? addresses.at(-1));
  }, [addresses, setCurrentAddress]);

  return (
    <section>
      <h1 className="py-4 font-garamond px-4 font-semibold text-lg text-gray-900 dark:bg-white/6 dark:text-white/90 bg-white">
        Shopping Carts
      </h1>
      <div className="flex justify-between items-center border-y py-4 mb-2 border-stone-200 dark:border-stone-900 dark:bg-white/6 bg-white px-4">
        {loading ? (
          <div className="p-2 pr-4 flex-1 rounded-xl space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : ( 
          <Activity mode={currentAddress ? 'visible' : 'hidden'}>
            <div className=" flex-1">
              <div className="mb-1 text-gray-950 dark:text-white/90 flex gap-x-4 items-center">
                <p className="xl:text-sm text-xs font-bold">Delivery To : </p>
                <p className="font-semibold text-xs xl:text-sm line-clamp-1  ">
                  {currentAddress?.name} {currentAddress?.pincode}
                </p>
              </div>
              <p className="text-xs xl:text-sm line-clamp-1 text-stone-500 dark:text-white/50 ">
                {currentAddress?.address}, {currentAddress?.phone},{" "}
                {currentAddress?.landmark}, {currentAddress?.locality}{" "}
              </p>
            </div>
          </Activity>
        )}
        <ChooseAddress
          addresses={addresses}
          currentAddressId={currentAddress?.id}
          onSelectAddress={(addr: Address) => {
            setCurrentAddress(addr);
            localStorage.setItem("current-addr", addr.id);
          }}
        />
      </div>
      <div className="bg-white dark:bg-white/6">
        {cart?.length >= 0 &&
          cart?.map((item, i) => (
            <CartItems
              key={i}
              name={item.name}
              productId={item.productId}
              image={item.image}
              size={item.size}
              price={item.price}
              updatedAt={item.updatedAt}
            />
          ))}
      </div>
    </section>
  );
};

export default CartProduct;
