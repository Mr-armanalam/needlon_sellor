"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { adminApi } from "../admin-api";

interface BannerRow {
  id: string;
  name: string;
  description: string | null;
  image: string;
  offer: string | null;
  slug: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BannerForm {
  name: string;
  description: string;
  image: string;
  offer: string;
  slug: string;
  displayOrder: string;
  isActive: boolean;
}

const EMPTY_FORM: BannerForm = {
  name: "",
  description: "",
  image: "",
  offer: "",
  slug: "",
  displayOrder: "0",
  isActive: true,
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400";
const labelClass = "block text-xs font-medium text-gray-500 mb-1";

export default function HeroBannersManager() {
  const [banners, setBanners] = useState<BannerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<BannerForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const data = await adminApi<{ banners: BannerRow[] }>(
        "/api/admin/hero-banners",
      );
      setBanners(data.banners);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load banners");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        description: form.description || null,
        image: form.image,
        offer: form.offer || null,
        slug: form.slug || null,
        displayOrder: Number(form.displayOrder),
        isActive: form.isActive,
      };

      if (editingId) {
        await adminApi(`/api/admin/hero-banners/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminApi("/api/admin/hero-banners", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save banner");
    }
  };

  const remove = async (row: BannerRow) => {
    if (!window.confirm(`Delete hero banner "${row.name}"?`)) return;
    try {
      await adminApi(`/api/admin/hero-banners/${row.id}`, {
        method: "DELETE",
      });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete banner");
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={submit}
        className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
      >
        <p className="text-sm font-semibold text-gray-900">
          {editingId ? "Edit hero banner" : "Add hero banner"}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className={labelClass}>Name *</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Offer text</label>
            <input
              className={inputClass}
              value={form.offer}
              onChange={(e) => setForm({ ...form, offer: e.target.value })}
              placeholder="e.g. Up to 50% off"
            />
          </div>
          <div>
            <label className={labelClass}>Link slug</label>
            <input
              className={inputClass}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="e.g. festive-collection"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Image URL *</label>
            <input
              className={inputClass}
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Display order</label>
            <input
              className={inputClass}
              type="number"
              min="0"
              value={form.displayOrder}
              onChange={(e) =>
                setForm({ ...form, displayOrder: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <input
              className={inputClass}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />
              Active (shown on storefront)
            </label>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            {editingId ? "Save changes" : "Add banner"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY_FORM);
              }}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <p className="p-5 text-sm text-gray-400">Loading banners…</p>
        ) : banners.length === 0 ? (
          <p className="p-5 text-sm text-gray-400">No hero banners yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-[#FAFAFA] text-xs text-gray-400 uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Banner</th>
                <th className="px-5 py-3 font-medium">Offer</th>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Active</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((row) => (
                <tr key={row.id} className="border-b border-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{row.name}</p>
                    <p className="max-w-md truncate text-xs text-gray-400">
                      {row.image}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{row.offer ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-600">{row.displayOrder}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {row.isActive ? "Yes" : "No"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingId(row.id);
                          setForm({
                            name: row.name,
                            description: row.description ?? "",
                            image: row.image,
                            offer: row.offer ?? "",
                            slug: row.slug ?? "",
                            displayOrder: String(row.displayOrder),
                            isActive: row.isActive,
                          });
                        }}
                        className="font-medium text-gray-700 hover:text-gray-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => void remove(row)}
                        className="font-medium text-red-600 hover:text-red-800"
                      >
                        Delete
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
