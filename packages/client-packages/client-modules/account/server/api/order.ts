import { GroupedOrder } from "@/types/order";
import { OrderItemProp } from "@/types/product";

export async function fetchOrders(search: string): Promise<GroupedOrder[]> {
  const res = await fetch(`/api/orders?search=${search}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch orders");

  return res.json();
}

export async function getOrder(orderId: string, cookieStore: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/orders/${orderId}`,
    {
      cache: "no-store",
      headers: {Cookie: cookieStore },
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data as OrderItemProp[];
}