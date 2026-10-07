export type GroupedOrder = {
  orderId: string;
  createdAt: Date | null;
  status: string;
  total: number;
  currency: string | null;
  paymentId: string | null;
  items: {
    productName: string;
    image: string | null;
    price: number;
    properties: string | null;
  }[];
};