import ProductPage from "@/modules/product/view/product-page";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: Promise<{ item: string }> }) => {
  const { item: productId } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products/${productId}`,
  );
  const { productItem } = await response.json();

  if (!productItem) {
    notFound();
  }
    

  return <ProductPage productData={productItem} />;
};

export default page;
