
export const DEFAULT_FORM_DATA = {
    name: 'Handloom Chikankari Kurti',
    brandLabel: 'House of Needlon',
    category: 'Ethnic Wear',
    subcategory: 'Kurtis',
    descriptionStory: 'Write about the weave type, artisan background, and tailoring elements...',
    retailPrice: '2450',
    discountOfferRate: '10',
    sizesMatrix: 'S, M, L, XL, XXL',
    colorsTrack: 'Ivory White, Indigo Blue',
    fabricMaterial: '100% Chanderi Cotton',
    sleevesStyle: 'Three-Quarter Sleeve',
    fitType: 'Straight Regular Fit',
    occasionFocus: 'Festival, Office Wear',
    genderProfile: 'Women',
    targetAgeGroup: 'Adults (18-45 Years)',
    boutiqueStockCount: '14',
    uniqueSku: `NDLN-ETH-KUR-${Math.floor(100 + Math.random() * 900)}`,
    pickupHubAddress: 'Studio Workshop, Block 4C, Kalyan, Maharashtra',
    packageWeight: '0.35',
    deliveryRadiusRange: 'Nationwide Shipping',
    estimatedDeliveryWindow: '3 - 5 business days delivery timeline',
    searchKeywords: 'handloom, chikankari, festive kurti, cotton apparel',
    customVisibility: 'PUBLIC' as const,
    mediaUrls: [] as string[],
};

// Preset Taxonomy Options
export const CATEGORY_SUBCATEGORY_MAP: Record<string, string[]> = {
    'Ethnic Wear': ['Kurtis', 'Salwar Suits', 'Lehengas', 'Ethnic Sets', 'Anarkalis', 'Dupattas'],
    'Western Wear': ['Dresses', 'Tops & Tunics', 'Shirts', 'Jeans & Denim', 'Skirts', 'Trousers'],
    'Dupattas': ['Chanderi Dupattas', 'Silk Dupattas', 'Cotton Dupattas', 'Bandhani Dupattas'],
    'Sarees': ['Banarasi Silk', 'Chanderi Saree', 'Linen Saree', 'Chiffon Saree', 'Organza Saree'],
    'Footwear': ['Juttis', 'Kolhapuris', 'Heels & Sandals', 'Flats'],
    'Accessories': ['Handbags & Clutches', 'Jewelry', 'Scarves & Stoles'],
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
export const VISIBILITY_OPTIONS = ['PUBLIC', 'UNLISTED', 'DRAFT'];

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