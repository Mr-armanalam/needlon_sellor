"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import ProductDescriptionn from "./product-description";
import { DetailedProductResponse } from "@/types/product";

const ProductCourusel = ({
  productData: data,
}: {
  productData: DetailedProductResponse;
}) => {

  // const corouselImages = [
  //   data.product_items.image,
  //   ...(data.product_items.modalImage ?? []),
  // ];
  

  // console.log(data, 'cour');
  

  const mainImage = data?.image;
  const additionalImages = data?.modalImage ?? [];

  const corouselImages = [mainImage, ...additionalImages].filter(Boolean);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
        skipSnaps: false,
        containScroll: false,
      }}
      className="md:h-150 h-120 relative"
    >
      <CarouselContent className="pl-1 ">
        {corouselImages.length !== 0 &&
          corouselImages.map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/3 pl-4 ol-1">
              <Card className="rounded-xs bg-[#eaeaea] dark:bg-white/6 py-0 border-0">
                <CardContent className="flex relative mt-auto h-120 md:h-150 items-center justify-center">
                  <Image
                    src={image ?? "/images/image1.png"}
                    alt="product image"
                    fill
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious
        size={"xl"}
        className="border-none dark:bg-black cursor-pointer shadow-lg left-2"
      />
      <CarouselNext
        size={"xl"}
        className=" md:left-98 max-md:right-2 dark:bg-black cursor-pointer border-none shadow-lg"
      />
      {data && <ProductDescriptionn productData={data} />}
    </Carousel>
  );
};

export default ProductCourusel;
