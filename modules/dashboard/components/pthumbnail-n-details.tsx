import { productType } from "../data/dashboard-productsData";

const PrdThumbnailNdetails = ({product}:{product:productType}) => {
  return (
    <div className="flex items-start gap-3.5">
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-[15px] shadow-inner shrink-0 ${product.imageColor}`}
      >
        {product.initials}
      </div>

      <div className="flex flex-col gap-0.5">
        <h4 className="text-[14px] font-semibold text-neutral-900 tracking-tight line-clamp-1">
          {product.name}
        </h4>
        <span className="text-[15px] font-bold text-neutral-800">
          {product.price}
        </span>
        {/* Low Stock Badge Trigger */}
        <span
          className={`text-[11px] font-medium mt-0.5 max-w-max px-1.5 py-0.5 rounded ${
            product.stock <= 5
              ? "bg-red-50 text-red-600 animate-pulse"
              : "bg-neutral-50 text-neutral-500"
          }`}
        >
          {product.stock} left in stock
        </span>
      </div>
    </div>
  );
};

export default PrdThumbnailNdetails;
