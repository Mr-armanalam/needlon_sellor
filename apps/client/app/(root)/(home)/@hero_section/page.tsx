import React from "react";
import { Metadata } from "next";
import SubcatSearch from "@/modules/home/components/hero-components/subcat-search";
import HeroSlider from "@/modules/home/components/hero-components/hero-slider";
import { MOCK_HERO_ITEMS, MOCK_SUB_CAT_SEARCH_ITEMS } from "@/lib/mock-data-provider";
import { getApiBaseUrl } from "@/lib/get-api-url";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Needlon | home",
  description: "A fashionable clothing tailoring service",
};

import { heroProps } from "@/modules/home/types/hero-types";

const page = async () => {
  let tailoringServices: heroProps[] = MOCK_HERO_ITEMS;
  let subCatSearches: any[] = MOCK_SUB_CAT_SEARCH_ITEMS;

  try {
    const baseUrl = await getApiBaseUrl();
    const heroItemResponse = await fetch(`${baseUrl}/api/hero-items`, { cache: "no-store" });
    if (heroItemResponse.ok) {
      const heroItemResult = await heroItemResponse.json();
      if (heroItemResult?.items) {
        tailoringServices = heroItemResult.items;
      }
    }
  } catch (error) {
    console.warn("Failed to fetch hero items, using fallback mock data:", (error as Error).message);
  }

  try {
    const baseUrl = await getApiBaseUrl();
    const subcatItemResponse = await fetch(`${baseUrl}/api/sub-cat-search`, { cache: "no-store" });
    if (subcatItemResponse.ok) {
      const subcatItemResult = await subcatItemResponse.json();
      if (subcatItemResult?.items) {
        subCatSearches = subcatItemResult.items;
      }
    }
  } catch (error) {
    console.warn("Failed to fetch sub-cat items, using fallback mock data:", (error as Error).message);
  }

  return (
    <section className="xl:px-8 max-md:px-3 max-md:pt-3 mb-8 xl:mb-16 w-full">
      <SubcatSearch subCatSearchesItem={subCatSearches} />
      <HeroSlider tailoringServices={tailoringServices} />
    </section>
  );
};

export default page;
