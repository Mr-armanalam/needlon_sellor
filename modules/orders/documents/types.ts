export interface AddressBlock {
  recipientName: string;
  phoneNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export interface SellerInfo {
  storeName: string;
  legalName?: string;
  gstin?: string;
  email?: string;
  phone?: string;
  address: AddressBlock;
}

export interface OrderDocumentItem {
  id: string;
  productName: string;
  variantName?: string;
  sku?: string;
  hsnCode?: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number; // e.g. 0.18 for 18%
  taxAmount?: number;
  discountAmount?: number;
  total: number;
  weightKg?: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  orderNumber: string;
  orderDate: string;
  paymentMethod: string;
  paymentStatus: string;
  seller: SellerInfo;
  buyer: {
    name: string;
    email: string;
    phone: string;
    shippingAddress: AddressBlock;
    billingAddress?: AddressBlock;
  };
  items: OrderDocumentItem[];
  subtotal: number;
  taxTotal: number;
  cgstTotal?: number;
  sgstTotal?: number;
  discountTotal: number;
  shippingCharge: number;
  grandTotal: number;
  qrCodeUrl?: string;
  terms?: string[];
  signatureText?: string;
}

export interface PackingSlipData {
  orderNumber: string;
  orderDate: string;
  shippingMethod?: string;
  seller: SellerInfo;
  buyer: {
    name: string;
    phone: string;
    shippingAddress: AddressBlock;
  };
  items: OrderDocumentItem[];
  totalQuantity: number;
  totalWeightKg: number;
  packingNotes?: string;
}

export interface ShippingLabelData {
  orderNumber: string;
  trackingNumber: string;
  courierName: string;
  isCod: boolean;
  codAmount: number;
  weightKg: number;
  seller: SellerInfo;
  buyer: {
    name: string;
    phone: string;
    shippingAddress: AddressBlock;
  };
  itemSummary: string;
  date: string;
}

export interface ManifestOrderItem {
  orderNumber: string;
  buyerName: string;
  buyerPhone: string;
  cityState: string;
  itemsCount: number;
  weightKg: number;
  isCod: boolean;
  codAmount: number;
  trackingNumber: string;
}

export interface ManifestData {
  manifestNumber: string;
  pickupDate: string;
  courierName: string;
  seller: SellerInfo;
  totalOrders: number;
  totalWeightKg: number;
  totalCodAmount: number;
  orders: ManifestOrderItem[];
}
