"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { adminApi } from "../admin-api";

type CategoryStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  code: string;
  description: string | null;
  parentId: string | null;
  path: string;
  level: number;
  sortOrder: number;
  status: CategoryStatus;
  isVisible: boolean;
  isFeatured: boolean;
}

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  parentId: string;
  sortOrder: string;
  status: CategoryStatus;
  isVisible: boolean;
  isFeatured: boolean;
}

const EMPTY_FORM: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  parentId: "",
  sortOrder: "0",
  status: "ACTIVE",
  isVisible: true,
  isFeatured: false,
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400";
const labelClass = "block text-xs font-medium text-gray-500 mb-1";

export default function CategoriesManager() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const data = await adminApi<{ categories: CategoryRow[] }>(
        "/api/admin/categories",
      );
      setCategories(data.categories);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories");
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
        parentId: form.parentId || null,
        sortOrder: Number(form.sortOrder),
        status: form.status,
        isVisible: form.isVisible,
        isFeatured: form.isFeatured,
      };
      if (!editingId && form.slug) payload.slug = form.slug;
      if (editingId && form.slug) payload.slug = form.slug;

      if (editingId) {
        await adminApi(`/api/admin/categories/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminApi("/api/admin/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    }
  };

  const remove = async (row: CategoryRow) => {
    if (!window.confirm(`Delete category "${row.name}"?`)) return;
    try {
      await adminApi(`/api/admin/categories/${row.id}`, { method: "DELETE" });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
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
          {editingId ? "Edit category" : "Add category"}
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
            <label className={labelClass}>
              Slug {editingId ? "" : "(auto-generated if blank)"}
            </label>
            <input
              className={inputClass}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Parent category</label>
            <select
              className={inputClass}
              value={form.parentId}
              onChange={(e) => setForm({ ...form, parentId: e.target.value })}
            >
              <option value="">— Root category —</option>
              {categories
                .filter((c) => c.id !== editingId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {"— ".repeat(c.level)}
                    {c.name}
                  </option>
                ))}
            </select>
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
          <div>
            <label className={labelClass}>Sort order</label>
            <input
              className={inputClass}
              type="number"
              min="0"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: e.target.value })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as CategoryStatus })
              }
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
          <div className="flex items-end gap-5 pb-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.isVisible}
                onChange={(e) =>
                  setForm({ ...form, isVisible: e.target.checked })
                }
              />
              Visible
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm({ ...form, isFeatured: e.target.checked })
                }
              />
              Featured
            </label>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            {editingId ? "Save changes" : "Add category"}
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
          <p className="p-5 text-sm text-gray-400">Loading categories…</p>
        ) : categories.length === 0 ? (
          <p className="p-5 text-sm text-gray-400">No categories yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-[#FAFAFA] text-xs text-gray-400 uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Path</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Visible</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((row) => (
                <tr key={row.id} className="border-b border-gray-50">
                  <td className="px-5 py-3">
                    <p
                      className="font-medium text-gray-900"
                      style={{ paddingLeft: `${row.level * 16}px` }}
                    >
                      {row.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {row.slug} · {row.code}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{row.path}</td>
                  <td className="px-5 py-3 text-gray-600">{row.status}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {row.isVisible ? "Yes" : "No"}
                    {row.isFeatured ? " · Featured" : ""}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingId(row.id);
                          setForm({
                            name: row.name,
                            slug: row.slug,
                            description: row.description ?? "",
                            parentId: row.parentId ?? "",
                            sortOrder: String(row.sortOrder),
                            status: row.status,
                            isVisible: row.isVisible,
                            isFeatured: row.isFeatured,
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
