export interface CustomerDisplayItem {
  id: string;
  name: string;
  avatar: string;
  location: string;
  clv: string;
  totalOrders: number;
  isRepeat: boolean;
}

/**
 * Ensures unique customer items by ID to prevent duplicate React rendering keys.
 */
export function deduplicateCustomers(customers: CustomerDisplayItem[]): CustomerDisplayItem[] {
  const seen = new Set<string>();
  const result: CustomerDisplayItem[] = [];

  for (const item of customers) {
    if (item.id && !seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    } else if (!item.id) {
      result.push(item);
    }
  }

  return result;
}
