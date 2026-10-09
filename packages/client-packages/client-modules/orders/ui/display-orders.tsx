/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import NoUserAddress from "@/modules/account/shared/no-user-address";
import { GroupedOrder } from "@/types/order";
import { format } from "date-fns";
import { BoxIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface props {
  loading: boolean;
  orders: GroupedOrder[];
}

const DisplayOrders = ({ loading, orders }: props) => {
  return (
    <div className="mt-7 overflow-y-scroll no-scrollbar">
      {loading ? (
        <p className="px-6">Loading orders...</p>
      ) : orders.length ? (
        <div className="overflow-y-scroll max-md:px-2 no-scrollbar ">
          {orders.length != 0 &&
            orders?.map((order, index) => (
              <Link
                href={`/account/orders/${order.orderId}`}
                key={index}
                className={`border-y hover:shadow-md cursor-pointer dark:border-stone-900 border-stone-200 mb-1.5 hover:mb-2.5 flex`}
              >
                <div className="relative md:w-47.5 max-md:w-40 max-md:h-40 md:h-47.5">
                  <Image
                    src={order.items[0].image ?? ""}
                    fill
                    alt="wishlist items"
                  />
                  {order.items.length > 1 && (
                    <div className="absolute z-15 bottom-2 p-1 bg-white dark:bg-black dark:border-stone-900 border-white right-2 size-16 border rounded">
                      <Image
                        src={order.items[1].image!}
                        fill
                        alt="wishlist 2nd item"
                      />
                    </div>
                  )}
                  {order.items.length > 2 && (
                    <p className="absolute bottom-4 bg-white dark:bg-black p-0.5 font-semibold rounded-full text-xs right-4 z-20">
                      +{order.items.length - 1}
                    </p>
                  )}
                </div>

                <div className="relative w-full">
                  <div className="md:my-6 max-md:my-3 ml-6 flex-1 dark:text-white/90 text-stone-800">
                    <h1 className="font-semibold">
                      {order.items[0].productName}
                    </h1>
                    <p className="text-sm pl-0.5 lowercase dark:text-white/70 text-stone-600">
                      Size: {order.items[0].properties}
                    </p>
                    <h2 className="text-2xl font-semibold my-2">
                      ₹{order.total}
                    </h2>
                    <div className="flex max-md:hidden gap-x-6">
                      <Button className="text-xs rounded-full mt-3">
                        Order placed
                      </Button>
                      <Button
                        variant={"outline"}
                        className="text-xs rounded-full mt-3"
                      >
                        Prepaid
                      </Button>
                    </div>
                    <div className="md:hidden text-sm" >
                      <p>Placed | Prepaid</p>
                    </div>
                    <p className="absolute md:bottom-6 md:right-4 text-stone-500 text-xs ">
                      Delivery expected on{" "}
                      {format(String(order.createdAt), "dd MMMM")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      ) : (
        // <p className="text-gray-500">No orders found.</p>
        <NoUserAddress Icon={BoxIcon} description="No orders found" />
      )}
    </div>
  );
};

export default DisplayOrders;
