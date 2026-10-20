import NewItemView from "@/modules/new-in/view/new-item-view";
import { getNewSectionProduct } from "@/modules/shared/product-items/server/get-new-section-products";
import type { BestSellerResponse } from "@/types/product";

type NewSectionProductResult = Awaited<ReturnType<typeof getNewSectionProduct>>[number];

// Map the product service DTO to the BestSellerResponse shape the view
// consumes (the service marks several fields optional and returns
// totalSales as a number, the view expects them present / as a string).
function toBestSellerResponse(item: NewSectionProductResult): BestSellerResponse {
  return {
    product: {
      id: item.product.id,
      categoryId: item.product.categoryId ?? "",
      name: item.product.name,
      tagName: item.product.tagName ?? "",
      mrp_price: item.product.mrp_price,
      price: item.product.price,
      image: item.product.image,
      modalImage: item.product.modalImage,
      sizes: item.product.sizes,
      quantity: item.product.quantity ?? 0,
      averageRating: item.product.averageRating ?? "",
      seller: item.product.seller ?? null,
      salesCount: item.product.salesCount ?? 0,
      reviewCount: item.product.reviewCount ?? 0,
      isPremium: item.product.isPremium ?? false,
      createdAt: item.product.createdAt ?? null,
      updatedAt: item.product.updatedAt ?? null,
    },
    totalSales: String(item.totalSales),
    Category: item.Category,
  };
}

const page = async({params}:{params: Promise<{type: string}>}) => {
  const {type} = await params;

  const results = (await getNewSectionProduct({ type })) || [];
  const newSectionProducts: BestSellerResponse[] = results.map(toBestSellerResponse);

  return <NewItemView newSectionProducts={newSectionProducts} />;
};

export default page;
