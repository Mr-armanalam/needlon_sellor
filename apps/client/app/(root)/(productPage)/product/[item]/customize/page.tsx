import ProductCustomizeView from "@/modules/product/view/product-customize-view";
import { ProductDetailService } from "@/modules/product/services/product-details-services";
import { notFound } from "next/navigation";
import { getApiBaseUrl } from "@/lib/get-api-url";

export const metadata = {
  title: "Bespoke Customization & Measurements | Needlon Atelier",
  description: "Customize your bespoke garment with precise artisanal tailoring measurements and posture specifications.",
};

const CustomizePage = async ({
  params,
}: {
  params: Promise<{ item: string }>;
}) => {
  const { item: productId } = await params;
  let productItem = null;

  try {
    const baseUrl = await getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/products/${productId}`, {
      cache: "no-store",
    });
    if (response.ok) {
      const data = await response.json();
      productItem = data.productItem;
    }
  } catch (error) {
    console.warn("Product customize page fetch fallback:", (error as Error).message);
  }

  if (!productItem) {
    // Fallback to direct service lookup
    const record = await ProductDetailService.getProductBase(productId);
    if (record?.product_items) {
      productItem = {
        ...record.product_items,
        category: record.product_category,
      };
    }
  }

  if (!productItem) {
    notFound();
  }

  return <ProductCustomizeView productData={productItem} />;
};

export default CustomizePage;
