import HomePremRecomLike from "@/modules/home/ui/home-prem-recom-like";
import { getProductByType } from "@/modules/shared/product-items/server/get-product-by-type";
import React from "react";

export const dynamic = "force-dynamic";

const page = async() => {
  const userLikeItem = await getProductByType({type: 'user_like'}) || [];
  return (
    <section>
      <HomePremRecomLike navigateTo="/you-may-like" items={userLikeItem} heading={"You may like"} />
    </section>
  );
};

export default page;
