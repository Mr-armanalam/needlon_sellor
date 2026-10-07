"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import SignIn from "../../auth/signin/page";

export const mAccountData = [
  {
    name: "Your Account",
    navigator: [
      {
        label: "Your Profile",
        link: "/account/profile",
      },
      {
        label: "Manage Address",
        link: "/account/address",
      },
    ],
  },
  {
    name: "Your Items",
    navigator: [
      {
        label: "Your Wishlist",
        link: "/account/wishlist",
      },
      {
        label: "Your Cart",
        link: "/cart",
      },
      {
        label: "Your Orders",
        link: "/account/orders",
      },
    ],
  },
  {
    name: "Update & Discount",
    navigator: [
      {
        label: "Your Coupons",
        link: "/account/rewards ",
      },
      {
        label: "All Notifications",
        link: "/account/updates",
      },
    ],
  },
];

const page = () => {
  const { data: session } = useSession();
  return session?.user.id ? (
    <section className="px-2 w-full">
      <div className="mt-4 flex flex-col gap-y-3 px-1">
        {mAccountData.length > 0 &&
          mAccountData.map((item, index) => (
            <div className=" bg-zinc-200 rounded-md px-4 py-2" key={index}>
              <h1 className="text-2xl font-garamond">{item.name}</h1>
              <div className="flex flex-col gap-y-1 text-sm font-garamond mt-1.5">
                {item.navigator.length > 0 &&
                  item?.navigator?.map((item, i) => (
                    <Link
                      href={item.link}
                      className="flex justify-between rounded hover:bg-white hover:py-1 px-2"
                      key={item.label + i}
                    >
                      <p className="border-b hover:border-dashed hover:border-black">
                        {item.label}
                      </p>
                      <p>&gt;</p>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        <button
          onClick={() => signOut({ redirectTo: "/" })}
          type="button"
          className="cursor-pointer bg-zinc-200 rounded-md px-4 py-2 text-2xl font-garamond"
        >
          Logout
        </button>
      </div>
    </section>
  ) : (
    <SignIn />
  );
};

export default page;
