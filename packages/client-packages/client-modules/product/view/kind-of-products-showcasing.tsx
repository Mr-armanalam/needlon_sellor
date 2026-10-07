"use client";
import { addToCart, fetchCart } from "@/features/cart-slice";
import ItemControl from "@/modules/category/components/item-control";
import Heading from "@/modules/category/section/heading";
import CheckoutPrompt from "@/modules/category/ui/checkout-prompt";
import Products from "@/modules/category/ui/product";
import { useAppDispatch } from "@/store/store";
import { Product, ProductData } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const KindOfProductShowcasing = () => {
  
  const { categories } = useParams<{
    categories: string;
  }>();

  const searchParams = useSearchParams();
  // console.log(categories,'vas');
  

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

  /* ------------------------------------------------------------------
      DYNAMIC PARAMETER COLLECTION
     This logic collects EVERYTHING in the URL bar and maps it to your 
     API requirements without hardcoding specific keys like 'color'.
  ------------------------------------------------------------------ */
  const filters = useMemo(() => {
    // Start with the base filter from the URL path (categories)
    const params: Record<string, string> = {
      filterType: Array.isArray(categories)
        ? categories.join(",")
        : categories || "",
      sort: searchParams.get("sort") || "featured",
    };

    // Automatically grab every other search param (color, material, sleeve, etc.)
    searchParams.forEach((value, key) => {
      if (key !== "sort") {
        // We already handled sort with a default
        params[key] = value;
      }
    });

    return params;
  }, [categories, searchParams]);

  const { data, isLoading } = useQuery<Product>({
    queryKey: ["kindOfProductsShowcasing", filters],
    queryFn: async (): Promise<Product> => {
      const query = new URLSearchParams(filters).toString();

      const res = await fetch(`/api/kofproducts?${query}`, {
        cache: "no-cache",
      });
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
  });

  // console.log(data, 'data');

  return ( data &&
    <div className="px-6 py-8">
      <Heading productTagDes={data?.productTagDes!} />
      <ItemControl
        sort={sort}
        category={categories}
        setFilterOpen={setFilterOpen}
        isFilterHide={true}
      />

      {data?.productData?.length != 0 && (
        <Products
          onAddToCart={handleAddToCart}
          productData={data?.productData!}
        />
      )}

      {open && <CheckoutPrompt setOpen={setOpen} />}

    </div>
  );
};

export default KindOfProductShowcasing;
