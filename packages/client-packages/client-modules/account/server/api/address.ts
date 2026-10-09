import { Address, IndianState } from "@/types/address";


export async function getAddresses(userId: string): Promise<Address[]> {
  const res = await fetch(`/api/addresses?userId=${userId}`);
  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.addresses;
}

export async function deleteAddressApi(id: string) {
  const res = await fetch("/api/addresses", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message);
  }

  return id;
}

export async function addOrUpdateAddressApi({
  userId,
  data,
  editingAddressId,
}: {
  userId: string;
  data: Omit<Address, "id" | "createdAt" | "updatedAt">;
  editingAddressId?: string;
}) {
  const res = await fetch("/api/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, data, editingAddressId }),
  });

  const result = await res.json();

  if (!result.success) {
    throw new Error(result.message);
  }

  return result;
}

export async function fetchStatesApi(): Promise<IndianState[]> {
  const res = await fetch("/api/state");
  const data = await res.json();

  if (!data?.states) return [];
  return data.states as IndianState[];
}
