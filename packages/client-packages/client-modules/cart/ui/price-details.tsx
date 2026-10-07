"use client";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/features/cart-slice";
import React, { useState } from "react";
import ApplyCoupon from "../components/apply-coupen";

const PriceDetails = ({
  userId,
  cart,
  currentAddressId,
}: {
  currentAddressId?: string;
  userId: string;
  cart: CartItem[];
}) => {  
  const price = Math.round(
    cart?.reduce((totalPrice, item) => totalPrice + Number(item.price), 0)
  );
  const mrp_price = Math.round(
    cart?.reduce((totalPrice, item) => totalPrice + Number(item?.mrp_price), 0)
  );
  const discount = Math.round(mrp_price - price);
  const [couponDiscount, setCouponDiscount] = useState({
    code: "",
    percent: 0,
    value: 0,
    id: ''
  });
  const totalCouponDiscount = couponDiscount.value
    ? couponDiscount.value
    : (price * couponDiscount.percent) / 100;

  const handlePayment = async () => {
  try {
    if (!currentAddressId) return;

    // Temporary logic: add shipping charge per product
    const cartWithShipping = cart.map((item) => ({
      ...item,
      shippingCharge: item.shippingCharge ?? 50, 
    }));

    const response = await fetch("/api/checkout", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartItems: cartWithShipping,
        percentDiscount: couponDiscount.percent,
        discountAmount: couponDiscount.value,
        couponId: couponDiscount.id,
        price: Math.round(price),
        mrp_price: Math.round(mrp_price),
        userId,
        currentAddressId,
      }),
    });

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.log(error);
  }
};

// console.log(couponDiscount, 'coupon');


  return (
    <section>
      <h1 className="px-4 py-4 text-md dark:text-white text-stone-500 font-semibold font-garamond border-b">
        PRICE DETAILS
      </h1>
      <div className="mx-4">
        <table className="w-full border-separate border-spacing-y-4 dark:text-white text-stone-600 font-roboto-sans">
          <tbody>
            <tr className="my-3">
              <td>Price ({cart.length ?? 0} item)</td>
              <td className="text-right">₹ {mrp_price}</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td className="text-right text-green-600"> ₹{discount}</td>
            </tr>
            <tr>
              <td className="flex items-center gap-1">
                Coupons for you{" "}
                <span
                  className="text-gray-400 cursor-pointer"
                  title="Coupon Applied"
                >
                  ⓘ
                </span>
              </td>
              <td className="text-right text-green-600">
                - ₹{totalCouponDiscount}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {couponDiscount.value === 0 && couponDiscount.percent === 0 && (
        <ApplyCoupon setCouponDiscount={setCouponDiscount} />
      )}

      <div className="flex px-4 py-5 border-y border-dashed justify-between font-bold text-lg dark:text-white/90 text-gray-800">
        <span>Total Amount</span>
        <span>₹{price - totalCouponDiscount}</span>
      </div>

      <div className="mx-4">
        <p className="text-green-600 text-sm font-semibold my-4">
          You will save ₹{discount + totalCouponDiscount} on this order
        </p>
        <Button
          onClick={handlePayment}
          type="button"
          className="h-11 cursor-pointer w-full mb-6 flex-1"
        >
          Proceed to Buy
        </Button>
      </div>
    </section>
  );
};

export default PriceDetails;
