export async function fetchProductsClient(activeTab: string, searchQuery: string) {
  const params = new URLSearchParams();
  if (activeTab && activeTab !== "All") {
    params.append("status", activeTab.toUpperCase().replace(" ", "_"));
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }

  const res = await fetch(`/api/products?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

export async function createProductClient(payload: any) {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to create product");
  }
  return res.json();
}

export async function deleteProductClient(id: string) {
  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }
  return res.json();
}
