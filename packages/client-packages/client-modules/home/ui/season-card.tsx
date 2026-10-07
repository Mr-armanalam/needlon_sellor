import RatingDisplay from "@/modules/shared/rating/ratingDisplay";
import { ClientProductItem } from "@/types/product";
import Image from "next/image";

const SeasonCard = ({ productData }: { productData: ClientProductItem }) => {
  return (
    <div className=" flex-1 min-w-85 flex flex-col py-10 bg-linear-to-tl rounded-lg from-gray-950 to-gray-900 dark:from-black dark:border dark:to-white/4">
      <div className="relative mx-8 rounded-2xl box-border min-h-75 flex-1">
        <Image
          src={productData.image ?? "/images/image2.png"}
          fill
          className="object-fill rounded-2xl h-75"
          alt="season image"
        />
      </div>
      <div className="text-white mt-2">
        <div className="relative px-8 pt-8 text-white">
          {/* Rating and Reviews */}
          <div className="flex text-[8px] items-center mb-3 gap-x-2">
            <span className="mb-px">{productData.averageRating}</span>
            <RatingDisplay
              color="#fff "
              size={9}
              avgRating={productData.averageRating}
            />
            / 5
          </div>

          <h2 className="text-2xl font-extrabold leading-snug mb-2">
            {productData.name}
          </h2>

          <p className="text-lg font-semibold">
            {Math.ceil(Number(productData.price))} ₹
          </p>

          {/* Category / Tagline */}
          <p className="text-sm text-gray-400 font-light">
            {productData.tagName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeasonCard;
