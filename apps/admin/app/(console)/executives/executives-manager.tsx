"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { adminApi } from "../admin-api";

type ExecutiveStatus =
  | "PENDING_VERIFICATION"
  | "ACTIVE"
  | "SUSPENDED"
  | "INACTIVE";

interface ExecutiveRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  vehicleType: string | null;
  vehicleNumber: string | null;
  licenseNumber: string | null;
  city: string | null;
  status: ExecutiveStatus;
  isAvailable: boolean;
  hasPassword: boolean;
}

interface ExecutiveForm {
  name: string;
  phone: string;
  email: string;
  secret: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
}

/** API field name for the executive credential in create/update payloads. */
const PASSWORD_FIELD = "password";

const EMPTY_FORM: ExecutiveForm = {
  name: "",
  phone: "",
  email: "",
  secret: "",
  vehicleType: "",
  vehicleNumber: "",
  licenseNumber: "",
};

const STATUSES: ExecutiveStatus[] = [
  "PENDING_VERIFICATION",
  "ACTIVE",
  "SUSPENDED",
  "INACTIVE",
];

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400";
const labelClass = "block text-xs font-medium text-gray-500 mb-1";

export default function ExecutivesManager() {
  const [executives, setExecutives] = useState<ExecutiveRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ExecutiveForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    try {
      setError(null);
      const data = await adminApi<{ executives: ExecutiveRow[] }>(
        "/api/admin/executives",
      );
      setExecutives(data.executives);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load roster");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        phone: form.phone,
        vehicleType: form.vehicleType || undefined,
        vehicleNumber: form.vehicleNumber || undefined,
        licenseNumber: form.licenseNumber || undefined,
      };
      if (form.email) payload.email = form.email;
      if (form.secret) payload[PASSWORD_FIELD] = form.secret;

      if (editingId) {
        await adminApi(`/api/admin/executives/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminApi("/api/admin/executives", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save executive");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (row: ExecutiveRow) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      phone: row.phone,
      email: row.email ?? "",
      secret: "",
      vehicleType: row.vehicleType ?? "",
      vehicleNumber: row.vehicleNumber ?? "",
      licenseNumber: row.licenseNumber ?? "",
    });
  };

  const changeStatus = async (row: ExecutiveRow, status: ExecutiveStatus) => {
    try {
      await adminApi(`/api/admin/executives/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const remove = async (row: ExecutiveRow) => {
    if (!window.confirm(`Remove ${row.name} from the roster?`)) return;
    try {
      await adminApi(`/api/admin/executives/${row.id}`, { method: "DELETE" });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove executive");
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
          {editingId ? "Edit executive" : "Add executive"}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className={labelClass}>Full name *</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Phone *</label>
            <input
              className={inputClass}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              className={inputClass}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>
              {editingId ? "New password (optional)" : "Password (optional)"}
            </label>
            <input
              className={inputClass}
              type="password"
              value={form.secret}
              onChange={(e) => setForm({ ...form, secret: e.target.value })}
              placeholder="Leave blank to keep unset"
            />
          </div>
          <div>
            <label className={labelClass}>Vehicle type</label>
            <input
              className={inputClass}
              value={form.vehicleType}
              onChange={(e) =>
                setForm({ ...form, vehicleType: e.target.value })
              }
              placeholder="Bike / Van / Cycle"
            />
          </div>
          <div>
            <label className={labelClass}>Vehicle number</label>
            <input
              className={inputClass}
              value={form.vehicleNumber}
              onChange={(e) =>
                setForm({ ...form, vehicleNumber: e.target.value })
              }
            />
          </div>
          <div>
            <label className={labelClass}>License number</label>
            <input
              className={inputClass}
              value={form.licenseNumber}
              onChange={(e) =>
                setForm({ ...form, licenseNumber: e.target.value })
              }
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Save changes" : "Add executive"}
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
          <p className="p-5 text-sm text-gray-400">Loading roster…</p>
        ) : executives.length === 0 ? (
          <p className="p-5 text-sm text-gray-400">
            No delivery executives yet. Add the first one above.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-[#FAFAFA] text-xs text-gray-400 uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Executive</th>
                <th className="px-5 py-3 font-medium">Vehicle</th>
                <th className="px-5 py-3 font-medium">Login</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {executives.map((row) => (
                <tr key={row.id} className="border-b border-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{row.name}</p>
                    <p className="text-xs text-gray-400">
                      {row.phone}
                      {row.email ? ` · ${row.email}` : ""}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {row.vehicleType ?? "—"}
                    {row.vehicleNumber ? ` · ${row.vehicleNumber}` : ""}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {row.hasPassword ? "Password set" : "No password"}
                    {row.status === "ACTIVE"
                      ? row.isAvailable
                        ? " · Available"
                        : " · Unavailable"
                      : ""}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      className="rounded-lg border border-gray-200 px-2 py-1 text-sm"
                      value={row.status}
                      onChange={(e) =>
                        void changeStatus(row, e.target.value as ExecutiveStatus)
                      }
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => startEdit(row)}
                        className="font-medium text-gray-700 hover:text-gray-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => void remove(row)}
                        className="font-medium text-red-600 hover:text-red-800"
                      >
                        Remove
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
