export const DEFAULT_MOCK_CATEGORIES = [
  { id: "cat-1", category: "formal",     CatType: "men",   SubCatType: "shirts",  contentTag: "Classic Fit",    descriptiveContent: "Premium formal shirts crafted for modern men."      },
  { id: "cat-2", category: "outerwears", CatType: "men",   SubCatType: "jackets", contentTag: "Winter Special", descriptiveContent: "Stylish jackets and blazers for every occasion."    },
  { id: "cat-3", category: "formal",     CatType: "women", SubCatType: "dresses", contentTag: "Elegance",       descriptiveContent: "Elegant formal attire designed for confidence."     },
  { id: "cat-4", category: "outerwears", CatType: "women", SubCatType: "coats",   contentTag: "Trending",       descriptiveContent: "Trendy premium coats for the modern woman."         },
  { id: "cat-5", category: "casual",     CatType: "men",   SubCatType: "tshirts", contentTag: "Everyday Wear",  descriptiveContent: "Comfortable casual wear for everyday style."        },
  { id: "cat-6", category: "casual",     CatType: "women", SubCatType: "tops",    contentTag: "Summer Ready",   descriptiveContent: "Breezy summer tops and casual fashion for women."   },
];

export const DEFAULT_MOCK_FILTER_GROUPS = [
  {
    id: "fg-1", name: "Material", slug: "material", sortOrder: 1,
    options: [
      { id: "fo-1", label: "100% Cotton", slug: "cotton", value: "cotton" },
      { id: "fo-2", label: "Linen",       slug: "linen",  value: "linen" },
      { id: "fo-3", label: "Polyester",   slug: "poly",   value: "poly" },
    ],
  },
  {
    id: "fg-2", name: "Fit", slug: "fit", sortOrder: 2,
    options: [
      { id: "fo-4", label: "Slim Fit",    slug: "slim",    value: "slim" },
      { id: "fo-5", label: "Regular Fit", slug: "regular", value: "regular" },
      { id: "fo-6", label: "Relaxed Fit", slug: "relaxed", value: "relaxed" },
    ],
  },
  {
    id: "fg-3", name: "Season", slug: "season", sortOrder: 3,
    options: [
      { id: "fo-7", label: "Summer",  slug: "summer",  value: "summer" },
      { id: "fo-8", label: "Winter",  slug: "winter",  value: "winter" },
    ],
  },
];

export const DEFAULT_MOCK_HERO_ITEMS = [
  {
    id: "hero-1", name: "Autumn Luxury Collection 2026",
    description: "Discover handcrafted premium apparel designed for unmatched sophistication and comfort.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1400",
    offer: "FLAT 30% OFF", slug: "autumn-collection", timestamp: new Date(),
  },
  {
    id: "hero-2", name: "Bespoke Italian Tailoring",
    description: "Elevate your wardrobe with custom tailored suits and fine cotton shirts.",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=1400",
    offer: "NEW ARRIVALS", slug: "italian-tailoring", timestamp: new Date(),
  },
];

export const DEFAULT_MOCK_SUB_CAT_SEARCH_ITEMS = [
  { id: "sc-1", name: "Shirts",   slug: "shirts",   catType: "men",   category: "formal"     },
  { id: "sc-2", name: "Blazers",  slug: "blazers",  catType: "men",   category: "outerwears" },
  { id: "sc-3", name: "Dresses",  slug: "dresses",  catType: "women", category: "formal"     },
  { id: "sc-4", name: "Coats",    slug: "coats",    catType: "women", category: "outerwears" },
  { id: "sc-5", name: "T-Shirts", slug: "tshirts",  catType: "men",   category: "casual"     },
  { id: "sc-6", name: "Tops",     slug: "tops",     catType: "women", category: "casual"     },
];

export const DEFAULT_MOCK_PRODUCTS = [
  {
    id: "p-101", categoryId: "cat-1",
    name: "Classic Oxford Cotton Shirt",          tagName: "Best Seller",
    mrp_price: 3499,  price: 2499,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600",
    modalImage: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600",
    ],
    sizes: ["S","M","L","XL"], quantity: 50, averageRating: "4.80", seller: "seller-1", salesCount: 142, reviewCount: 38, isPremium: true,
    createdAt: new Date("2026-09-01"), updatedAt: new Date("2026-09-15"),
  },
  {
    id: "p-102", categoryId: "cat-1",
    name: "Slim Fit Linen Striped Shirt",         tagName: "Trending",
    mrp_price: 2999,  price: 1999,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600",
    modalImage: ["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600"],
    sizes: ["M","L","XL"], quantity: 35, averageRating: "4.65", seller: "seller-1", salesCount: 98, reviewCount: 24, isPremium: false,
    createdAt: new Date("2026-09-10"), updatedAt: new Date("2026-09-20"),
  },
];
