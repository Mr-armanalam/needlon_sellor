import React from "react";
import { CouponCard } from "../components/coupon-card";
import { Rewards } from "@/app/(root)/(account)/account/rewards/page";

export default function RewardsView({allRewards}:{allRewards: Rewards[]}) {  
  return (
    <section>
      <h1 className="font-garamond text-2xl font-semibold dark:text-white text-gray-900">
        Your rewards & coupons
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-7">
        {allRewards.length >= 0 &&
          allRewards.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
      </div>
      <p className="font-garamond mx-auto text-center w-full mt-25 text-gray-500 font-semibold text-xl">
        End Here
      </p>
    </section>
  );
}

