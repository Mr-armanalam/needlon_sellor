import { DetailedProductResponse, individualProduct } from '@/types/product'
import ProductShowcase from '../sections/product-showcase'
import ProductDetails from '../sections/product-details'
import { Suspense } from 'react'
import Loading from '../components/loading'
import MobProductPrice from '../sections/mob-product-price'

const ProductPage = ({productData}:{productData: DetailedProductResponse}) => {  

  return (
    <div className='md:px-8 max-md:pt-3 px-3 max-md:max-w-[100vw]'>
      <Suspense fallback={<Loading />} >
        <ProductShowcase productData={productData} />
        <MobProductPrice productData={productData} />
        <ProductDetails productData={productData} />
      </Suspense>
    </div>
  )
}

export default ProductPage