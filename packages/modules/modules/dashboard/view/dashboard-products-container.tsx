import ProdLightWtMetricBar from "../components/prd-light-weight-metricbar";
import PrdThumbnailNdetails from "../components/pthumbnail-n-details";
import SubtleUtilities from "../components/subtle-utilities";
import { products } from "../data/dashboard-productsData";

const DashboardProductCont = () => {
  return (
    <div className="flex gap-5 overflow-x-auto pb-4 pt-1 -mx-2 px-2 no-scrollbar snap-x">
      {products.map((product) => (
        <div
          key={product.id}
          className="snap-start min-w-72.5 w-72.5 bg-white border border-neutral-100/80 rounded-2xl p-4 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.02)]"
        >
          <PrdThumbnailNdetails product={product} />
          <ProdLightWtMetricBar product={product} />
          <SubtleUtilities />
        </div>
      ))}
    </div>
  );
};

export default DashboardProductCont;
