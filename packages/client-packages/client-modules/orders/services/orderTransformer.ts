import { GroupedOrder } from "@/types/order";

export function groupOrderItems(rawData: any[]): GroupedOrder[] {
  const grouped = rawData.reduce((acc, row) => {
    const { orderId, createdAt, status, total, currency, paymentId, ...item } = row;

    if (!acc[orderId]) {
      acc[orderId] = {
        orderId,
        createdAt,
        status,
        total,
        currency,
        paymentId,
        items: [],
      };
    }

    acc[orderId].items.push(item);
    return acc;
  }, {} as Record<string, GroupedOrder>);

  return Object.values(grouped);
}