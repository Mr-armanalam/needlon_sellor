"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../admin-api";

interface SellerRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  storeId: string | null;
  storeName: string | null;
  storeVerified: boolean;
  ordersCount: number;
}

export default function SellersManager() {
  const [sellers, setSellers] = useState<SellerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const data = await adminApi<{ sellers: SellerRow[] }>(
        "/api/admin/sellers",
      );
      setSellers(data.sellers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sellers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const patch = async (row: SellerRow, body: Record<string, boolean>) => {
    try {
      const updated = await adminApi<SellerRow>(`/api/admin/sellers/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      setSellers((current) =>
        current.map((s) => (s.id === updated.id ? updated : s)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update seller");
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <p className="p-5 text-sm text-gray-400">Loading sellers…</p>
        ) : sellers.length === 0 ? (
          <p className="p-5 text-sm text-gray-400">No seller accounts yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-[#FAFAFA] text-xs text-gray-400 uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Seller</th>
                <th className="px-5 py-3 font-medium">Store</th>
                <th className="px-5 py-3 font-medium">Orders</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Account</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((row) => (
                <tr key={row.id} className="border-b border-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{row.name}</p>
                    <p className="text-xs text-gray-400">
                      {row.email}
                      {row.phone ? ` · ${row.phone}` : ""}
                    </p>
                    <p className="text-xs text-gray-400">
                      Role: {row.role} · Email{" "}
                      {row.emailVerified ? "verified" : "unverified"}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {row.storeName ?? "—"}
                    {row.storeId && (
                      <span className="block text-xs text-gray-400">
                        {row.storeVerified ? "Verified store" : "Unverified store"}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{row.ordersCount}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {new Date(row.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        row.isActive
                          ? "font-medium text-emerald-600"
                          : "font-medium text-red-600"
                      }
                    >
                      {row.isActive ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-3">
                      {row.storeId && (
                        <button
                          onClick={() =>
                            void patch(row, { isVerified: !row.storeVerified })
                          }
                          className="font-medium text-gray-700 hover:text-gray-900"
                        >
                          {row.storeVerified ? "Unverify store" : "Verify store"}
                        </button>
                      )}
                      <button
                        onClick={() =>
                          void patch(row, { isActive: !row.isActive })
                        }
                        className={
                          row.isActive
                            ? "font-medium text-red-600 hover:text-red-800"
                            : "font-medium text-emerald-600 hover:text-emerald-800"
                        }
                      >
                        {row.isActive ? "Suspend" : "Reactivate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
