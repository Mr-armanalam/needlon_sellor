export const DOCUMENT_TYPES = {
  INVOICE: "INVOICE",
  PACKING_SLIP: "PACKING_SLIP",
  SHIPPING_LABEL: "SHIPPING_LABEL",
  MANIFEST: "MANIFEST",
} as const;

export type DocumentType = keyof typeof DOCUMENT_TYPES;

export const PAPER_SIZES = {
  A4: "A4",
  LABEL_4X6: "4x6",
} as const;

export const DOCUMENT_CONFIG = {
  COMPANY_NAME: "Needlon Marketplace",
  GSTIN_DEFAULT: "27AAAAA0000A1Z5",
  CURRENCY: "INR",
  CURRENCY_SYMBOL: "₹",
  DEFAULT_TAX_RATE: 0.18, // 18% GST (9% CGST + 9% SGST)
  WATERMARK_TEXT: "ORIGINAL FOR RECIPIENT",
  SUPPORT_EMAIL: "support@needlon.com",
  SUPPORT_PHONE: "+91 1800 123 4567",
};
