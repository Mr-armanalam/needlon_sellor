"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminApi } from "../admin-api";

interface SettingsData {
  commissionRate: number;
  settings: Array<{
    key: string;
    value: unknown;
    updatedAt: string;
  }>;
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400";
const labelClass = "block text-xs font-medium text-gray-500 mb-1";

export default function SettingsForm() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [commissionPercent, setCommissionPercent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi<SettingsData>("/api/admin/settings")
      .then((result) => {
        setData(result);
        setCommissionPercent(String(result.commissionRate * 100));
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load settings"),
      );
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSaved(false);
    const percent = Number(commissionPercent);
    if (!Number.isFinite(percent) || percent < 0 || percent >= 100) {
      setError("Commission must be a percentage between 0 and 100 (exclusive).");
      return;
    }
    setSaving(true);
    try {
      const result = await adminApi<SettingsData>("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify({ commissionRate: percent / 100 }),
      });
      setData(result);
      setCommissionPercent(String(result.commissionRate * 100));
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (!data && !error) {
    return <p className="text-sm text-gray-400">Loading settings…</p>;
  }

  return (
    <div className="flex max-w-2xl flex-col space-y-6">
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {saved && (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Settings saved. The new commission applies to dashboard and
          earnings calculations immediately.
        </div>
      )}

      <form
        onSubmit={submit}
        className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
      >
        <p className="text-sm font-semibold text-gray-900">
          Marketplace commission
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Percentage of each delivered order&apos;s value kept by the
          platform. Stored as the platform setting{" "}
          <code>commissionRate</code>.
        </p>
        <div className="mt-4 max-w-xs">
          <label className={labelClass}>Commission (%)</label>
          <input
            className={inputClass}
            type="number"
            min="0"
            max="99.99"
            step="0.01"
            value={commissionPercent}
            onChange={(e) => setCommissionPercent(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>

      {data && data.settings.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">All settings</p>
          <ul className="mt-3 space-y-2">
            {data.settings.map((setting) => (
              <li
                key={setting.key}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-mono text-gray-600">{setting.key}</span>
                <span className="text-gray-900">
                  {JSON.stringify(setting.value)}
                  <span className="ml-3 text-xs text-gray-400">
                    updated{" "}
                    {new Date(setting.updatedAt).toLocaleString("en-IN")}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
