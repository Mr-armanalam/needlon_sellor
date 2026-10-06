"use client";

import { useRouter } from "next/navigation";
import ProdLightWtMetricBar from "../components/prd-light-weight-metricbar";
import PrdThumbnailNdetails from "../components/pthumbnail-n-details";
import SubtleUtilities from "../components/subtle-utilities";
import { products as defaultProducts } from "../data/dashboard-productsData";
import { DashboardProductDto } from "../dto/dashboard.dto";

interface DashboardProductContProps {
  products?: DashboardProductDto[];
  onDuplicate?: (productId: string) => void;
  actionLoadingMap?: Record<string, boolean>;
}

const DashboardProductCont = ({
  products,
  onDuplicate,
  actionLoadingMap = {},
}: DashboardProductContProps) => {
  const router = useRouter();
  const productList = products && products.length > 0 ? products : defaultProducts;

  return (
    <div className="flex gap-5 overflow-x-auto pb-4 pt-1 -mx-2 px-2 no-scrollbar snap-x">
      {productList.map((product) => (
        <div
          key={product.id}
          onClick={() => router.push("/products")}
          className="snap-start min-w-72.5 w-72.5 bg-white border border-neutral-100/80 rounded-2xl p-4 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.02)] cursor-pointer"
        >
          <PrdThumbnailNdetails product={product as any} />
          <ProdLightWtMetricBar product={product as any} />
          <SubtleUtilities
            productId={product.id.toString()}
            productSlug={(product as any).slug}
            onDuplicate={onDuplicate}
            isLoadingDuplicate={!!actionLoadingMap[`dup-${product.id}`]}
          />
        </div>
      ))}
    </div>
  );
};

export default DashboardProductCont;

