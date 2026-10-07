import { DetailedProductResponse, individualProduct } from "@/types/product";
import ProductCourusel from "../ui/product-courusel";

const ProductShowcase = ({
  productData,
}: {
  productData: DetailedProductResponse;
}) => {
  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  return (
    <section className="relative">
      <ProductCourusel productData={productData} />
    </section>
  );
};

export default ProductShowcase;
