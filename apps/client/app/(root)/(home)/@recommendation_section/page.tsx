import HomePremRecomLike from "@/modules/home/ui/home-prem-recom-like";
import { getProductByType } from "@/modules/shared/product-items/server/get-product-by-type";
import { toClientProductItem } from "@/lib/to-client-product-item";
import React from "react";

export const dynamic = "force-dynamic";

const page = async() => {
  const premiumItems = (await getProductByType({type: 'recommend'}) || []).map(toClientProductItem);

  return (
    <section>
      <HomePremRecomLike navigateTo="/recom-product" items={premiumItems} heading={"Recommended Items"} />
    </section>
  );
};

export default page;
