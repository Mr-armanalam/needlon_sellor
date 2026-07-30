export async function fetchOrdersClient(
  activeTab?: string,
  searchQuery?: string
) {
  const params = new URLSearchParams();
  if (activeTab) {
    params.append("status", activeTab.toUpperCase().replaceAll(" ", "_"));
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }

  const res = await fetch(`/api/seller/orders?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }
  return res.json();
}

export async function getOrderDetailsClient(orderId: string) {
  const res = await fetch(`/api/seller/orders/${orderId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch order details");
  }
  return res.json();
}

export async function updateOrderStatusClient(
  orderId: string,
  action: "ADVANCE" | "CANCEL",
  remarks?: string
) {
  const res = await fetch(`/api/seller/orders/${orderId}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, remarks }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to update order status");
  }
  return res.json();
}
