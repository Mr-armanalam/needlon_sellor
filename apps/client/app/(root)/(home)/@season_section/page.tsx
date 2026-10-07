import SeasonSection from '@/modules/home/section/season-section'
import { getSeasonProduct } from '@/modules/shared/product-items/server/get-season-product'
import React from 'react'

export const dynamic = "force-dynamic";

const page = async() => {
  const seasonProductData = await getSeasonProduct({seasonType: 'winter'});
  const seasonProduct = seasonProductData?.map(item => item.seasonProduct) ?? [];
  
  return (
    <section className='px-2'>
      <SeasonSection navigateTo='/season-product' seasonData = {seasonProduct} />
    </section>
  )
}

export default page