"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Heading from "../section/heading";
import ItemControl from "../components/item-control";
import FilterDrawer from "../ui/filter-drawer";
import Products from "../ui/product";
import CheckoutPrompt from "../ui/checkout-prompt";
import { useSession } from "next-auth/react";
import { addToCart, fetchCart } from "@/features/cart-slice";
import { useAppDispatch } from "@/store/store";

type ProductData = {
  id: string;
  name: string;
  price: number;
  image: string;
  modalImage?: string[] | null;
  sizes?: string[] | null;
  category?: string;
  catType?: string;
};

type Product = {
  productData: ProductData[] | [];
  productTagDes: {
    descriptiveContent: string;
    contentTag: string;
  };
};

const CategoryView = () => {
  const { categories, category } = useParams<{
    category: string;
    categories: string;
  }>();
  const [products, setProducts] = useState<Product>({
    productData: [],
    productTagDes: {
      descriptiveContent: "",
      contentTag: "",
    },
  });

  const searchParams = useSearchParams();

  const [filterOpen, setFilterOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const handleAddToCart = (product: ProductData, size: string) => {
    dispatch(
      addToCart({
        userId: session?.user.id,
        product: { ...product, size, quantity: 1 },
        size,
      }),
    );
    dispatch(fetchCart(session?.user.id ?? ""));
    setOpen(true);
  };

  const sort = searchParams.get("sort") || "featured";
  const material = searchParams.get("material");
  const sbct = searchParams.get("sbct");

  const productData = useCallback(async () => {
    await fetch(
      `/api/products?category=${categories}&subcategory=${category}&sbct=${sbct}&sort=${sort}${
        material ? `&material=${material}` : ""
      }`,
      { cache: "no-store" }, // always fresh
    )
      .then(async (res) => await res.json())
      .then(setProducts);
  }, [categories, category, material, sbct, sort]);

  useEffect(() => {
    productData();
  }, [category, sort, productData]);

  return (
    <div className="px-6 py-8">
      <Heading productTagDes={products.productTagDes} />
      <ItemControl
        sort={sort}
        category={category}
        setFilterOpen={setFilterOpen}
      />

      <Products
        onAddToCart={handleAddToCart}
        productData={products.productData}
      />

      {open && <CheckoutPrompt setOpen={setOpen} />}

      <FilterDrawer
        isOpen={filterOpen}
        category={category}
        onClose={() => setFilterOpen(false)}
      />
    </div>
  );
};

export default CategoryView;
