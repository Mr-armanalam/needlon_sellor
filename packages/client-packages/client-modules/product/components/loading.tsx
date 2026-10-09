import React from 'react'
import { ProductCouruselSkeleton } from '../ui/product-courusel-skeleton'
import { ProductDescriptionSkeleton } from '../ui/product-description-skeleton'

const Loading = () => {
  return (
    <div>
      <ProductCouruselSkeleton />
      <ProductDescriptionSkeleton />
    </div>
  )
}

export default Loading