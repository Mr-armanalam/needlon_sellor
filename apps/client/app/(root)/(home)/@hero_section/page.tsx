import React from "react";
import { Metadata } from "next";
import SubcatSearch from "@/modules/home/components/hero-components/subcat-search";
import HeroSlider from "@/modules/home/components/hero-components/hero-slider";
import { HeroBannerService } from "@/modules/home/services/hero-banner-service";
import { SearchService } from "@/modules/home/services/search-service";
import { heroProps } from "@/modules/home/types/hero-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Needlon | home",
  description: "A fashionable clothing tailoring service",
};

type SubCatSearchItem = Pick<heroProps, "id" | "name" | "slug" | "image" | "for_which">;
type SubCatSearchResult = Awaited<ReturnType<typeof SearchService.getSubCatSearchItems>>[number];

// SearchService returns { id, name, slug, catType, category } rows, while
// SubcatSearch expects the heroProps pick. The component never renders
// `image`; its navigation path uses `for_which`, which corresponds to the
// service's `catType` ("men" / "women").
function toSubCatSearchItem(item: SubCatSearchResult): SubCatSearchItem {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    image: "",
    for_which: item.catType,
  };
}

const page = async () => {
  let tailoringServices: heroProps[] = [];
  let subCatSearches: SubCatSearchItem[] = [];

  try {
    tailoringServices = (await HeroBannerService.getActiveHeroBanners()) as heroProps[];
  } catch (error) {
    console.warn("Failed to fetch hero items:", (error as Error).message);
  }

  try {
    const results = await SearchService.getSubCatSearchItems();
    subCatSearches = results.map(toSubCatSearchItem);
  } catch (error) {
    console.warn("Failed to fetch sub-cat items:", (error as Error).message);
  }

  return (
    <section className="xl:px-8 max-md:px-3 max-md:pt-3 mb-8 xl:mb-16 w-full">
      <SubcatSearch subCatSearchesItem={subCatSearches} />
      <HeroSlider tailoringServices={tailoringServices} />
    </section>
  );
};

export default page;
