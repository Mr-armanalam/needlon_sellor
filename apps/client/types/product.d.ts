import { Address } from "./address";

export interface productDataType {
  id: string;
  categoryId: string;
  name: string;
  tagName: string;
  mrp_price: string | null | number;
  price: number;
  image: string;
  modalImage: string[];
  sizes: string[];
  quantity: number;
  averageRating: string;
  reviewCount: number;
  isPremium: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ClientProductItem {
  id: string;
  name: string;
  tagName: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  categoryId: string;
  mrp_price: number | null;
  price: number;
  quantity: number;
  material?: string | null;
  sizes?: string[] | null;
  image: string | null;
  modalImage: string[] | null;
  averageRating: string;
  reviewCount: number;
  isPremium: boolean;
  seasonType?: string;
}

export interface BestSellerResponse {
  product: {
    id: string;
    categoryId: string;
    name: string;
    tagName: string;
    mrp_price: number | null;
    price: number;
    image: string | null;
    modalImage: string[] | null;
    sizes?: string[] | null;
    quantity: number;
    averageRating: string;
    seller: string | null;
    salesCount: number;
    reviewCount: number;
    isPremium: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  totalSales?: string; // Aggregate counts often return as strings
  Category: {
    categoryName: string;
    categoryType: string;
  } | null;
}

export interface OrderItemProp {
  orderDate: Date;
  orderId: string;
  shippingAddress: Address;
  paymentMode: string;
  shippingCharge: number;
  podCharge: number;
  priceAtperchage: number;
  productId: string;
  image: string;
  orderProperties?: string;
  itemName: string;
  couponDiscount: number;
  totalPurchasePrice: number;
}

export interface suggestionAndRecentSearch {
  id: string;
  name: string;
  category: string;
  subcategory: string;
}

export interface searchSuggestionProps {
  heading_name: string;
  recent: suggestionAndRecentSearch[];
  handleOnSelect: (item: suggestionAndRecentSearch) => void;
}

export interface ProductItemResult {
  id: string;
  categoryId: string;
  name: string;
  tagName: string;
  mrp_price: number | null;
  price: number;
  image: string | null;
  modalImage: string[] | null;
  quantity: number;
  averageRating: string;
  reviewCount: number;
  isPremium: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface ClientProductItemWithCategory extends ProductItemResult {
  category: string | null;
  CatType: string | null;
  SubCatType: string | null;
}

type ProductData = {
  id: string;
  name: string;
  price: number;
  image: string;
  modalImage?: string[] | null;
  sizes?: string[] | null;
  category?: string;
  catType?: string;
};

type Product = {
  productData: ProductData[];
  productTagDes: {
    descriptiveContent: string;
    contentTag: string;
  };
};

interface individualProduct {
  product_items: productDataType;
  product_category: {
    id: string;
    category: string;
    CatType: string;
    SubCatType: string;
    contentTag: string | null;
    descriptiveContent: string | null;
  } | null;
  productFilterData: { [x: string]: string }[];
}


export interface ProductAttributeMap {
  Color?: string;
  SIZE?: string;
  Collar?: string;
  'Sleeve length'?: string;
  collection?: string;
  [key: string]: string | undefined;
}

export interface DetailedCategory {
  id: string;
  category: string;
  CatType: string;
  SubCatType: string;
  contentTag: string;
  descriptiveContent: string;
  createdAt: string; // ISO Date string from JSON
}

export interface DetailedProductResponse {
  id: string;
  categoryId: string;
  name: string;
  tagName: string;
  mrp_price: number;
  price: number;
  image: string;
  modalImage: string[];
  sizes: string[];
  quantity: number;
  averageRating: string;
  seller: string | null;
  salesCount: number;
  reviewCount: number;
  isPremium: boolean;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  category: DetailedCategory;
  attributes: ProductAttributeMap;
}