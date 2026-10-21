"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { adminApi } from "../admin-api";

interface ArticleRow {
  id: string;
  category: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  readTime: string;
  icon: string;
  views: number;
  helpfulVotes: number;
  unhelpfulVotes: number;
  isPublished: boolean;
  createdAt: string;
}

interface ArticleForm {
  title: string;
  slug: string;
  category: string;
  description: string;
  content: string;
  icon: string;
  isPublished: boolean;
}

const EMPTY_FORM: ArticleForm = {
  title: "",
  slug: "",
  category: "selling",
  description: "",
  content: "",
  icon: "BookOpen",
  isPublished: true,
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400";
const labelClass = "block text-xs font-medium text-gray-500 mb-1";

export default function KnowledgeBaseManager() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const data = await adminApi<{ articles: ArticleRow[] }>(
        "/api/admin/knowledge-base",
      );
      setArticles(data.articles);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load articles");
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
        title: form.title,
        category: form.category,
        description: form.description,
        content: form.content,
        icon: form.icon || "BookOpen",
        isPublished: form.isPublished,
      };
      if (form.slug) payload.slug = form.slug;

      if (editingId) {
        await adminApi(`/api/admin/knowledge-base/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminApi("/api/admin/knowledge-base", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    }
  };

  const remove = async (row: ArticleRow) => {
    if (!window.confirm(`Delete article "${row.title}"?`)) return;
    try {
      await adminApi(`/api/admin/knowledge-base/${row.id}`, {
        method: "DELETE",
      });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete article");
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
          {editingId ? "Edit article" : "Add article"}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className={labelClass}>Title *</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>
              Slug (auto-generated from title if blank)
            </label>
            <input
              className={inputClass}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <input
              className={inputClass}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="selling · delivery · payment"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Icon</label>
            <input
              className={inputClass}
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) =>
                  setForm({ ...form, isPublished: e.target.checked })
                }
              />
              Published (visible to sellers)
            </label>
          </div>
          <div className="md:col-span-3">
            <label className={labelClass}>Description *</label>
            <input
              className={inputClass}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </div>
          <div className="md:col-span-3">
            <label className={labelClass}>Content *</label>
            <textarea
              className={inputClass}
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            {editingId ? "Save changes" : "Add article"}
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
          <p className="p-5 text-sm text-gray-400">Loading articles…</p>
        ) : articles.length === 0 ? (
          <p className="p-5 text-sm text-gray-400">No articles yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-[#FAFAFA] text-xs text-gray-400 uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Article</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Published</th>
                <th className="px-5 py-3 font-medium">Views</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((row) => (
                <tr key={row.id} className="border-b border-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{row.title}</p>
                    <p className="text-xs text-gray-400">
                      {row.slug} · {row.readTime}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{row.category}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {row.isPublished ? "Yes" : "Draft"}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{row.views}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingId(row.id);
                          setForm({
                            title: row.title,
                            slug: row.slug,
                            category: row.category,
                            description: row.description,
                            content: row.content,
                            icon: row.icon,
                            isPublished: row.isPublished,
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
