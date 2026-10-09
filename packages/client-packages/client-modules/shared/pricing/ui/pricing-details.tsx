import {
  priceCategoryData,
} from "@/data/price-data";
import VerticalPriceContainer from "../components/vertical-price-container";
import HorizontalPriceContainer from "../components/horizontal-price-container";

const PricingDetails = () => {
  return (
    <section className="pb-24 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {priceCategoryData.map((name, n) => (
          <div key={n}>
            <h2
              className="text-[#1A1D2E] dark:text-gray-400 text-3xl md:text-4xl text-center mb-12"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {name.itemCategory}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {name.categoryPrice.map((items, i) =>
                items.orientation === "vertical" && items.category ? (
                  <VerticalPriceContainer
                    key={i}
                    category={items.category}
                    categoryPriceData={items.categoryPriceData}
                  />
                ) : (
                  <HorizontalPriceContainer
                    key={i}
                    category={items.category}
                    categoryPriceData={items.categoryPriceData}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingDetails;