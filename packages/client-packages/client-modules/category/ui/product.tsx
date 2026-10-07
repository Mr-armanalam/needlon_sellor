import React from "react";
import ProductCard from "../components/product-card";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  modalImage?: string[] | null;
  sizes?: string[] | null;
  category?: string;
  catType?: string;
};

type ProductGridProps = {
  onAddToCart: (product: Product, size: string) => void;
  productData: Product[];
};

const Products = ({ onAddToCart, productData }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-y-16 gap-x-0.5">
      {productData.map((product, i) => (
        <ProductCard onAddToCart={onAddToCart} key={i} {...product} />
      ))}
    </div>
  );
};

export default Products;
