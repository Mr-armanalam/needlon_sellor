export * from "./constants/media";

export const DEFAULT_FORM_DATA = {
    name: '',
    brandLabel: '',
    brandId: '',
    brandName: '',
    category: '',
    categoryId: '',
    subcategory: '',
    subcategoryId: '',
    descriptionStory: '',
    currencyCode: 'INR',
    retailPrice: '',
    discountOfferRate: '0',
    compareAtPrice: '',
    costPrice: '',
    minimumAdvertisedPrice: '',
    effectiveFrom: '',
    effectiveUntil: '',
    isTaxInclusive: true,
    sizesMatrix: '',
    colorsTrack: 'Ivory White',
    fabricMaterial: '100% Chanderi Cotton',
    sleevesStyle: 'Three-Quarter Sleeve',
    fitType: 'Straight Regular Fit',
    occasionFocus: 'Festival, Office Wear',
    genderProfile: 'Women',
    targetAgeGroup: 'Adults (18-45 Years)',
    boutiqueStockCount: '',
    lowStockThreshold: '5',
    reservedQuantity: '0',
    allowBackorder: false,
    barcode: '',
    uniqueSku: '',
    position: '0',
    lastAdjustedAt: '',
    pickupHubId: '',
    pickupHubAddress: '',
    shippingPartnerId: '',
    shippingMethodId: '',
    deliveryZone: 'DOMESTIC',
    packageWeight: '',
    deliveryRadiusRange: 'Nationwide Shipping',
    estimatedDeliveryWindow: '3 - 5 business days delivery timeline',
    searchKeywords: '',
    customVisibility: 'PUBLIC' as const,
    isCustomizable: true,
    hasExistingOrders: false,
    slug: '',
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: null as string | null,
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: null as string | null,
    mediaUrls: [] as string[],
};

// Preset Taxonomy Options
export const CATEGORY_SUBCATEGORY_MAP: Record<string, string[]> = {
    'Mens Wear': ['Shirt', 'Pants', 'Coat', 'Jackets', 'Sapari', 'Kurta', 'Sherwani', 'Blazer', 'Trousers', 'Khand dress kurta'],
    'Women Wear': ['Shirts', 'Pants', 'Suit', 'Coat', 'Skirts', 'Lehanga', 'Blouse', 'Kurti', 'Jacket'],
    'Services': ['Mens wear', 'Women wear', 'Wedding & Wocation wear', 'Alteration & Fitting'],
};

export const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];
export const STANDARD_COLORS = ['Ivory White', 'Indigo Blue', 'Midnight Black', 'Crimson Red', 'Emerald Green', 'Pastel Pink', 'Mustard Yellow', 'Beige'];
export const STANDARD_FABRICS = ['100% Chanderi Cotton', 'Pure Silk', 'Organza', 'Rayon', 'Georgette', 'Linen Blend', 'Velvet'];
export const SLEEVES_OPTIONS = ['Three-Quarter Sleeve', 'Full Sleeve', 'Short Sleeve', 'Sleeveless', 'Cap Sleeve'];
export const FIT_OPTIONS = ['Straight Regular Fit', 'Slim Fit', 'Oversized Fit', 'Relaxed Fit', 'A-Line Fit'];
export const OCCASION_OPTIONS = ['Festival, Office Wear', 'Casual Daily Wear', 'Wedding Collection', 'Party Wear', 'Formal Office'];
export const GENDER_OPTIONS = ['Women', 'Men', 'Unisex', 'Girls', 'Boys'];
export const AGE_GROUP_OPTIONS = ['Adults (18-45 Years)', 'Teens (13-17 Years)', 'Kids (2-12 Years)', 'Seniors (45+ Years)'];
export const DELIVERY_RADIUS_OPTIONS = ['Nationwide Shipping', 'Statewide Delivery', 'Local City Delivery', 'International Express'];
export const DELIVERY_WINDOW_OPTIONS = ['3 - 5 business days delivery timeline', '1 - 2 business days', '5 - 7 business days', 'Same Day Dispatch'];
export const VISIBILITY_OPTIONS = ['PUBLIC', 'PRIVATE', 'UNLISTED'] as const;

export const wizardSteps = [
    { number: 1, label: "Photos" },
    { number: 2, label: "Basic Info" },
    { number: 3, label: "Pricing" },
    { number: 4, label: "Variants" },
    { number: 5, label: "Inventory" },
    { number: 6, label: "Delivery" },
    { number: 7, label: "SEO & Tags" },
    { number: 8, label: "Publish" },
];