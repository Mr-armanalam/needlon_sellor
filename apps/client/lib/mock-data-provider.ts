// =============================================================
// NEEDLON — CENTRALIZED MOCK DATA PROVIDER
// Phase 1: Full UI coverage while database is being migrated
// Replace this file's exports with real DB calls in Phase 3
// =============================================================

// ─────────────── CATEGORIES ───────────────
export const MOCK_CATEGORIES = [
  { id: "cat-1", category: "formal",     CatType: "men",   SubCatType: "shirts",  contentTag: "Classic Fit",    descriptiveContent: "Premium formal shirts crafted for modern men."      },
  { id: "cat-2", category: "outerwears", CatType: "men",   SubCatType: "jackets", contentTag: "Winter Special", descriptiveContent: "Stylish jackets and blazers for every occasion."    },
  { id: "cat-3", category: "formal",     CatType: "women", SubCatType: "dresses", contentTag: "Elegance",       descriptiveContent: "Elegant formal attire designed for confidence."     },
  { id: "cat-4", category: "outerwears", CatType: "women", SubCatType: "coats",   contentTag: "Trending",       descriptiveContent: "Trendy premium coats for the modern woman."         },
  { id: "cat-5", category: "casual",     CatType: "men",   SubCatType: "tshirts", contentTag: "Everyday Wear",  descriptiveContent: "Comfortable casual wear for everyday style."        },
  { id: "cat-6", category: "casual",     CatType: "women", SubCatType: "tops",    contentTag: "Summer Ready",   descriptiveContent: "Breezy summer tops and casual fashion for women."   },
];

// ─────────────── PRODUCTS ───────────────
export const MOCK_PRODUCTS = [
  {
    id: "p-101", categoryId: "cat-1",
    name: "Classic Oxford Cotton Shirt",          tagName: "Best Seller",
    mrp_price: 3499,  price: 2499,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600",
    modalImage: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600",
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
  {
    id: "p-103", categoryId: "cat-2",
    name: "Merino Wool Blend Blazer",             tagName: "Premium",
    mrp_price: 8999,  price: 6499,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
    modalImage: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600"],
    sizes: ["38R","40R","42R","44R"], quantity: 20, averageRating: "4.90", seller: "seller-1", salesCount: 64, reviewCount: 19, isPremium: true,
    createdAt: new Date("2026-08-20"), updatedAt: new Date("2026-09-05"),
  },
  {
    id: "p-104", categoryId: "cat-3",
    name: "Silk Satin Formal Evening Dress",      tagName: "New Arrival",
    mrp_price: 6999,  price: 4999,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600",
    modalImage: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600"],
    sizes: ["XS","S","M","L"], quantity: 15, averageRating: "4.85", seller: "seller-1", salesCount: 88, reviewCount: 30, isPremium: true,
    createdAt: new Date("2026-09-25"), updatedAt: new Date("2026-09-27"),
  },
  {
    id: "p-105", categoryId: "cat-4",
    name: "Cashmere Overcoat Women",              tagName: "Winter",
    mrp_price: 9999,  price: 7999,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
    modalImage: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600"],
    sizes: ["S","M","L"], quantity: 12, averageRating: "4.95", seller: "seller-1", salesCount: 52, reviewCount: 14, isPremium: true,
    createdAt: new Date("2026-09-18"), updatedAt: new Date("2026-09-28"),
  },
  {
    id: "p-106", categoryId: "cat-5",
    name: "Cotton Round Neck T-Shirt Men",        tagName: "Everyday",
    mrp_price: 999,   price: 699,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600",
    modalImage: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600"],
    sizes: ["S","M","L","XL","XXL"], quantity: 100, averageRating: "4.50", seller: "seller-1", salesCount: 220, reviewCount: 60, isPremium: false,
    createdAt: new Date("2026-09-05"), updatedAt: new Date("2026-09-22"),
  },
  {
    id: "p-107", categoryId: "cat-6",
    name: "Floral Print Summer Top Women",        tagName: "Summer Special",
    mrp_price: 1499,  price: 999,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600",
    modalImage: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600"],
    sizes: ["XS","S","M","L"], quantity: 75, averageRating: "4.60", seller: "seller-1", salesCount: 180, reviewCount: 45, isPremium: false,
    createdAt: new Date("2026-09-12"), updatedAt: new Date("2026-09-24"),
  },
  {
    id: "p-108", categoryId: "cat-2",
    name: "Italian Fit Double Breasted Coat",     tagName: "Premium",
    mrp_price: 12999, price: 9999,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600",
    modalImage: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600"],
    sizes: ["38R","40R","42R"], quantity: 8, averageRating: "4.97", seller: "seller-1", salesCount: 32, reviewCount: 9, isPremium: true,
    createdAt: new Date("2026-09-28"), updatedAt: new Date("2026-09-30"),
  },
];

// ─────────────── HERO ITEMS ───────────────
export const MOCK_HERO_ITEMS = [
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
  {
    id: "hero-3", name: "Winter Cashmere Edit",
    description: "Stay warm in style with our curated cashmere and wool winter collection.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1400",
    offer: "UP TO 40% OFF", slug: "winter-edit", timestamp: new Date(),
  },
];

// ─────────────── SUB-CATEGORY SEARCH ITEMS ───────────────
export const MOCK_SUB_CAT_SEARCH_ITEMS = [
  { id: "sc-1", name: "Shirts",   slug: "shirts",   catType: "men",   category: "formal"     },
  { id: "sc-2", name: "Blazers",  slug: "blazers",  catType: "men",   category: "outerwears" },
  { id: "sc-3", name: "Dresses",  slug: "dresses",  catType: "women", category: "formal"     },
  { id: "sc-4", name: "Coats",    slug: "coats",    catType: "women", category: "outerwears" },
  { id: "sc-5", name: "T-Shirts", slug: "tshirts",  catType: "men",   category: "casual"     },
  { id: "sc-6", name: "Tops",     slug: "tops",     catType: "women", category: "casual"     },
  { id: "sc-7", name: "Jackets",  slug: "jackets",  catType: "men",   category: "outerwears" },
  { id: "sc-8", name: "Skirts",   slug: "skirts",   catType: "women", category: "casual"     },
];

// ─────────────── FILTER GROUPS & OPTIONS ───────────────
export const MOCK_FILTER_GROUPS = [
  {
    id: "fg-1", name: "Material", slug: "material", categoryId: "cat-1", sortOrder: 1,
    options: [
      { id: "fo-1", label: "100% Cotton", slug: "cotton" },
      { id: "fo-2", label: "Linen",       slug: "linen"  },
      { id: "fo-3", label: "Polyester",   slug: "poly"   },
    ],
  },
  {
    id: "fg-2", name: "Fit", slug: "fit", categoryId: "cat-1", sortOrder: 2,
    options: [
      { id: "fo-4", label: "Slim Fit",    slug: "slim"    },
      { id: "fo-5", label: "Regular Fit", slug: "regular" },
      { id: "fo-6", label: "Relaxed Fit", slug: "relaxed" },
    ],
  },
  {
    id: "fg-3", name: "Season", slug: "season", categoryId: "cat-1", sortOrder: 3,
    options: [
      { id: "fo-7", label: "Summer",  slug: "summer"  },
      { id: "fo-8", label: "Winter",  slug: "winter"  },
      { id: "fo-9", label: "Casual",  slug: "casual"  },
    ],
  },
];

// ─────────────── MOCK ORDERS ───────────────
export const MOCK_ORDERS = [
  {
    orderId: "order-001",
    createdAt: new Date("2026-09-15T10:30:00"),
    status: "delivered",
    total: 7498,
    currency: "INR",
    paymentId: "pay_mockABC123",
    productName: "Classic Oxford Cotton Shirt",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600",
    price: 2499,
    properties: { size: "M", color: "White" },
  },
  {
    orderId: "order-002",
    createdAt: new Date("2026-09-28T14:00:00"),
    status: "shipped",
    total: 6499,
    currency: "INR",
    paymentId: "pay_mockDEF456",
    productName: "Merino Wool Blend Blazer",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
    price: 6499,
    properties: { size: "40R", color: "Navy" },
  },
  {
    orderId: "order-003",
    createdAt: new Date("2026-10-01T09:15:00"),
    status: "processing",
    total: 4999,
    currency: "INR",
    paymentId: "pay_mockGHI789",
    productName: "Silk Satin Formal Evening Dress",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600",
    price: 4999,
    properties: { size: "M", color: "Black" },
  },
];

// ─────────────── MOCK ORDER DETAIL (for /orders/[id]) ───────────────
export const MOCK_ORDER_DETAIL = [
  {
    orderDate: new Date("2026-09-15T10:30:00"),
    orderId: "orderitem-001",
    shippingAddress: {
      id: "addr-1", userId: "mock-user", name: "Arman Alam",
      line1: "123 Fashion Street", line2: "Near City Mall",
      city: "Hyderabad", state: "Telangana", zip: "500001", country: "India",
      phone: "+91 9876543210",
    },
    itemName: "Classic Oxford Cotton Shirt",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600",
    productId: "p-101",
    orderProperties: { size: "M", color: "White" },
    ratingId: null,
    paymentMode: "card",
    shippingCharge: 49,
    podCharge: 0,
    priceAtperchage: 2499,
    totalPurchasePrice: 7498,
    couponDiscount: 0,
  },
];

// ─────────────── MOCK ADDRESSES ───────────────
export const MOCK_ADDRESSES = [
  {
    id: "addr-1", userId: "mock-user",
    name: "Arman Alam", line1: "123 Fashion Street", line2: "Near City Mall",
    city: "Hyderabad", state: "Telangana", zip: "500001", country: "India",
    phone: "+91 9876543210", isDefault: true,
  },
  {
    id: "addr-2", userId: "mock-user",
    name: "Arman Alam", line1: "456 Design Avenue", line2: "Tech Park Area",
    city: "Bangalore", state: "Karnataka", zip: "560001", country: "India",
    phone: "+91 9876543210", isDefault: false,
  },
];

// ─────────────── MOCK CART ITEMS ───────────────
export const MOCK_CART_ITEMS = [
  { id: "ci-1", userId: "mock-user", productId: "p-101", size: "M",   quantity: 2 },
  { id: "ci-2", userId: "mock-user", productId: "p-103", size: "40R", quantity: 1 },
];

// ─────────────── MOCK WISHLIST ITEMS ───────────────
export const MOCK_WISHLIST_ITEMS = [
  { id: "wi-1", userId: "mock-user", productId: "p-104", size: "M",  quantity: 1 },
  { id: "wi-2", userId: "mock-user", productId: "p-105", size: "S",  quantity: 1 },
  { id: "wi-3", userId: "mock-user", productId: "p-108", size: "40R",quantity: 1 },
];

// ─────────────── MOCK NOTIFICATIONS ───────────────
export const MOCK_NOTIFICATIONS = [
  { id: "notif-1", userId: "mock-user", title: "Order Shipped!",     message: "Your order #order-002 has been shipped. Expected delivery in 2-3 days.", type: "order" as const, time: "2 days ago", read: false, createdAt: new Date("2026-09-28") },
  { id: "notif-2", userId: "mock-user", title: "Order Delivered",    message: "Your order #order-001 has been successfully delivered. Enjoy your purchase!", type: "order" as const, time: "1 week ago", read: true,  createdAt: new Date("2026-09-20") },
  { id: "notif-3", userId: "mock-user", title: "Exclusive Offer!",   message: "Get 25% OFF on all Premium collections this weekend. Use code: PREM25", type: "offer" as const, time: "3 days ago", read: false, createdAt: new Date("2026-10-01") },
  { id: "notif-4", userId: "mock-user", title: "New Arrival Alert",  message: "The Winter Cashmere Edit is now live. Shop before it sells out!", type: "system" as const, time: "Just now", read: false, createdAt: new Date("2026-10-03") },
];

// ─────────────── MOCK REWARDS / COUPONS ───────────────
export const MOCK_REWARDS = [
  {
    id: "rw-1", userId: "mock-user", coupon_id: "cpn-1",
    title: "Welcome Reward",    description: "First purchase discount",    points: 200,
    status: "active", expiresAt: new Date("2026-12-31"), coupon_code: "WELCOME20",
    createdAt: new Date("2026-09-01"),
  },
  {
    id: "rw-2", userId: "mock-user", coupon_id: "cpn-2",
    title: "Loyalty Reward",    description: "Loyalty member exclusive",    points: 500,
    status: "active", expiresAt: new Date("2026-11-30"), coupon_code: "LOYAL15",
    createdAt: new Date("2026-09-15"),
  },
  {
    id: "rw-3", userId: "mock-user", coupon_id: null,
    title: "Points Milestone",  description: "1000 points milestone bonus", points: 1000,
    status: "pending", expiresAt: new Date("2027-01-31"), coupon_code: null,
    createdAt: new Date("2026-10-01"),
  },
];

// ─────────────── MOCK USER INFO ───────────────
export const MOCK_USER_INFO = {
  name:   "Arman Alam",
  email:  "armanalam78578@gmail.com",
  phone:  "+91 9876543210",
  gender: "male" as "male" | "female",
};

// ─────────────── HELPER: Products with category joined ───────────────
export function getMockProductsWithCategory() {
  return MOCK_PRODUCTS.map((product) => {
    const category = MOCK_CATEGORIES.find((c) => c.id === product.categoryId) || MOCK_CATEGORIES[0];
    return {
      product: {
        ...product,
        seller: product.seller || "seller-1",
      },
      totalSales: product.salesCount,
      Category: { categoryName: category.category, categoryType: category.CatType },
      category: {
        id: category.id, category: category.category,
        CatType: category.CatType, SubCatType: category.SubCatType,
        contentTag: category.contentTag, descriptiveContent: category.descriptiveContent,
      },
    };
  });
}

// ─────────────── HELPER: Transformed product shape for /api/products and /api/kofproducts ───────────────
export function getMockTransformedProducts() {
  return getMockProductsWithCategory().map((r) => ({
    id: r.product.id,
    name: r.product.name,
    price: Number(r.product.price),
    mrp_price: Number(r.product.mrp_price),
    image: r.product.image,
    modalImage: r.product.modalImage,
    sizes: r.product.sizes,
    category: r.category.category,
    catType: r.category.CatType,
    rating: r.product.averageRating,
  }));
}

// ─────────────── HELPER: Season products ───────────────
export function getMockSeasonProducts(seasonType = "casual") {
  return MOCK_PRODUCTS.slice(0, 5).map((p) => ({ seasonProduct: p }));
}
