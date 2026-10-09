import { DetailedProductResponse } from "@/types/product";


const ProductDetails = ({ productData }: { productData: DetailedProductResponse }) => {
  if (!productData) return null;

  const { category, attributes = {} } = productData;

  return (
    <section className="min-h-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded px-1 py-8 md:p-8 bg-white dark:bg-stone-950">
      {/* Left Column: Descriptive Content */}
      <div>
        <h1 className="text-3xl font-garamond font-semibold mb-6 dark:text-white text-gray-900">
          About this {category?.SubCatType ?? "Collection"}
        </h1>
        <p className="font-roboto-sans text-sm leading-relaxed dark:text-white/80 text-stone-500 max-w-md">
          {category?.descriptiveContent}
        </p>
      </div>

      {/* Right Column: Dynamic Attributes */}
      <div className="flex flex-col gap-y-6">
        <p className="font-semibold text-sm uppercase tracking-widest border-b pb-2 self-start md:self-end">
          Specifications
        </p>
        
        <div className="space-y-4 md:text-right">
          {Object.entries(attributes).length > 0 ? (
            Object.entries(attributes).map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="font-bold text-gray-400 uppercase tracking-tighter">
                  {key}:
                </span>
                <span className="ml-2 dark:text-white text-gray-800 font-medium">
                  {String(value)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs italic text-stone-400">No specific attributes listed.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;








// import { DetailedProductResponse, individualProduct } from "@/types/product";
// import React from "react";

// const ProductDetails = ({
//   productData,
// }: {
//   productData: DetailedProductResponse;
// }) => {
//   const mergedProductFilterData = productData.productFilterData.reduce(
//     (acc: Array<Record<string, unknown[]>>, obj) => {
//       const key = Object.keys(obj)[0];
//       const value = obj[key];

//       // Find if an object with this specific key already exists in our array
//       const existingObj = acc.find((item) => Object.hasOwn(item, key));

//       if (existingObj) {
//         (existingObj[key] as unknown[]).push(value);
//       } else {
//         acc.push({ [key]: [value] });
//       }

//       return acc;
//     },
//     [],
//   );

//   return (
//     <section className="h-130 grid grid-cols-2 gap-0 items-center rounded p-8">
//       <div className="">
//         <h1 className="text-3xl font-garamond font-semibold mb-8 dark:text-white text-gray-900">
//           About this {productData.product_category?.SubCatType}
//         </h1>
//         <p className="font-roboto-sans text-sm dark:text-white/80 text-stone-500">
//           {productData.product_category?.descriptiveContent}
//         </p>
//       </div>
//       <div className="flex flex-col gap-y-8 items-center">
//         <p className="font-semibold  ml-auto border-b">Available</p>
//         <div className="text-xs">
//           {mergedProductFilterData.length > 0 &&
//             mergedProductFilterData.map((data, i) => (
//               <p key={i}>
//                 <span className="font-semibold capitalize ">
//                   {Object.keys(data)}:{" "}
//                 </span>
//                 {Object.values(data).join(", ")}
//                 {}
//               </p>
//             ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductDetails;
