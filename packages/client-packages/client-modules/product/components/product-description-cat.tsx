import RatingDisplay from "@/modules/shared/rating/ratingDisplay";
import {
  DetailedProductResponse,
  individualProduct,
  productDataType,
} from "@/types/product";
import React from "react";

type productDescriptioncatProp = {
  productItem: productDataType;
  productFilterData: { [x: string]: string }[];
};

const ProductDescriptionCat = ({
  productItem,
  // productFilterData,
}: {
  productItem: DetailedProductResponse;
}) => {
  const seenKeys = new Set();
  // const filteredData = productFilterData.filter((obj) => {
  //   const key = Object.keys(obj)[0];
  //   if (seenKeys.has(key)) {
  //     return false;
  //   }
  //   seenKeys.add(key);
  //   return true;
  // });

  if (!productItem) return null;

  const { attributes = {} } = productItem;

  return (
    <>
      <h2 className="mt-4 ml-2 text-stone-700 dark:text-gray-400 font-garamond line-clamp-1">
        {productItem.tagName}
      </h2>

      <div className="flex w-full line-clamp-1 flex-wrap gap-x-6 ml-2 text-sm font-garamond dark:text-gray-400 text-gray-500 mt-2">
        {Object.entries(attributes).length > 0 ? (
          Object.entries(attributes).map(([key, value]) => (
            <p key={key}>
              <span className="font-semibold capitalize dark:text-gray-200 text-gray-600">
                {key}:{" "}
              </span>
              {String(value)}
              {}
            </p>
          ))
        ) : (
          <p className="text-xs italic text-stone-400">
            No specific attributes listed.
          </p>
        )}
      </div>

      <div className="flex ml-2 text-sm mt-2 items-center dark:text-white text-gray-500 gap-x-1 ">
        <RatingDisplay size={12} avgRating={productItem.averageRating} />
        <span className="ml-2 text-sm dark:text-gray-400 text-gray-700">
          {productItem.averageRating} /{productItem.reviewCount}
        </span>
      </div>

      <div className="flex">
        <p className="text-7xl mt-4 font-garamond">
          <span className="text-[65px]">₹</span>
          {Math.round(Number(productItem.price))}
        </p>
        <p className="mt-auto ml-4 mr-2 text-3xl text-stone-400 font-garamond line-through">
          ₹{Math.round(Number(productItem.mrp_price))}
        </p>
        <p className="mt-auto text-2xl font-garamond text-green-600">
          {Math.round(
            (1 - Number(productItem.price) / Number(productItem.mrp_price)) *
              100,
          )}
          % off
        </p>
      </div>
    </>
  );
};

export default ProductDescriptionCat;
