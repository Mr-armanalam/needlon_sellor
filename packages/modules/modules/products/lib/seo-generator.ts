export interface SeoGeneratorInput {
  productName: string;
  brandName?: string | null;
  categoryName?: string | null;
  descriptionStory?: string | null;
  tags?: string[] | null;
  primaryImageUrl?: string | null;
  price?: string | number | null;
  currencyCode?: string | null;
  storeDomain?: string;
}

export interface GeneratedSeoData {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string | null;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string | null;
  structuredData: Record<string, unknown>;
}

export function generateProductSlug(name: string): string {
  const base = (name || "untitled-product")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word chars
    .replace(/[\s_-]+/g, "-") // collapse dashes and spaces
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes

  return base || "product";
}

export function generateProductSeoData(input: SeoGeneratorInput): GeneratedSeoData {
  const domain = (input.storeDomain || "https://needlon.com").replace(/\/+$/, "");
  const name = input.productName?.trim() || "Artisanal Tailored Piece";
  const brand = input.brandName?.trim() || "House of Needlon";
  const category = input.categoryName?.trim() || "Fashion & Apparel";

  const slug = generateProductSlug(name);
  const canonicalUrl = `${domain}/products/${slug}`;

  // Title: max 60 chars recommended for Google SERP
  const fullTitle = `${name} | ${brand}`;
  const metaTitle = fullTitle.length <= 60 ? fullTitle : fullTitle.slice(0, 57) + "...";

  // Description: max 160 chars recommended for Google SERP
  let cleanDesc = (input.descriptionStory || "").replace(/\s+/g, " ").trim();
  if (!cleanDesc) {
    cleanDesc = `Shop ${name} by ${brand}. Handcrafted bespoke fashion with precision fit and custom tailoring options available exclusively on Needlon.`;
  }
  const metaDescription = cleanDesc.length <= 160 ? cleanDesc : cleanDesc.slice(0, 157) + "...";

  // Keywords extraction
  const inputTags = Array.isArray(input.tags) ? input.tags : [];
  const keywordSet = new Set<string>();
  
  if (input.productName) {
    input.productName.toLowerCase().split(/\s+/).forEach((w) => {
      const clean = w.replace(/[^\w]/g, "");
      if (clean.length > 2) keywordSet.add(clean);
    });
  }
  if (brand) keywordSet.add(brand.toLowerCase());
  if (category) keywordSet.add(category.toLowerCase());
  inputTags.forEach((t) => {
    if (t && t.trim()) keywordSet.add(t.trim().toLowerCase());
  });

  const metaKeywords = Array.from(keywordSet).slice(0, 20);

  // Open Graph & Twitter
  const ogTitle = `${name} — Bespoke Tailored by ${brand}`;
  const ogDescription = metaDescription;
  const image = input.primaryImageUrl || null;

  // Schema.org Product JSON-LD structured data
  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    image: image ? [image] : [],
    description: metaDescription,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    category,
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: input.currencyCode || "INR",
      price: input.price ? String(input.price) : "0",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return {
    slug,
    metaTitle,
    metaDescription,
    metaKeywords,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage: image,
    twitterTitle: metaTitle,
    twitterDescription: metaDescription,
    twitterImage: image,
    structuredData,
  };
}
