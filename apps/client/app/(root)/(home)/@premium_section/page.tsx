import HomePremRecomLike from "@/modules/home/ui/home-prem-recom-like";
import { getProductByType } from "@/modules/shared/product-items/server/get-product-by-type";

export const dynamic = "force-dynamic";

const page = async() => {
  const premiumItems = await getProductByType({type: 'premium'}) || [];
  
  return (
    <section >
      <HomePremRecomLike navigateTo="/premium-product" items={premiumItems} heading={"Premium Items"} />
    </section>
  );
};

export default page;
