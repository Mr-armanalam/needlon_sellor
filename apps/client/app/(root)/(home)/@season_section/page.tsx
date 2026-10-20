import SeasonSection from '@/modules/home/section/season-section'
import { getSeasonProduct } from '@/modules/shared/product-items/server/get-season-product'
import type { ClientProductItem } from '@/types/product'
import React from 'react'

export const dynamic = "force-dynamic";

type SeasonProductResult = Awaited<ReturnType<typeof getSeasonProduct>>[number];

// getSeasonProduct returns one product DTO per row. The previous code read a
// `seasonProduct` property that this service has never returned, so the
// section received an array of `undefined`; map the actual product fields
// instead.
function toClientProductItem(product: SeasonProductResult): ClientProductItem {
  return {
    id: product.id,
    categoryId: product.categoryId ?? "",
    name: product.name,
    tagName: product.tagName ?? "",
    mrp_price: product.mrp_price,
    price: product.price,
    image: product.image,
    modalImage: product.modalImage,
    sizes: product.sizes,
    quantity: product.quantity ?? 0,
    averageRating: product.averageRating ?? "",
    reviewCount: product.reviewCount ?? 0,
    isPremium: product.isPremium ?? false,
    createdAt: product.createdAt ?? null,
    updatedAt: product.updatedAt ?? null,
  };
}

const page = async() => {
  const seasonProductData = await getSeasonProduct({seasonType: 'winter'});
  const seasonProduct: ClientProductItem[] = (seasonProductData ?? []).map(toClientProductItem);

  return (
    <section className='px-2'>
      <SeasonSection navigateTo='/season-product' seasonData={seasonProduct} />
    </section>
  )
}

export default page
