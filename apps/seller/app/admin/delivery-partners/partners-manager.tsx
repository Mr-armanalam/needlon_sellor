"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { adminApi } from "../admin-api";

type IntegrationType = "AGGREGATOR_API" | "DIRECT_API" | "MANUAL" | "INHOUSE";

interface PartnerRow {
  id: string;
  partnerCode: string;
  partnerName: string;
  integrationType: IntegrationType;
  apiBaseUrl: string | null;
  trackingUrlTemplate: string | null;
  isActive: boolean;
  methodsCount: number;
}

interface MethodRow {
  id: string;
  partnerId: string;
  methodCode: string;
  methodName: string;
  estimatedMinDays: number;
  estimatedMaxDays: number;
  baseCharge: string;
  perKgCharge: string;
  maxWeightKg: string | null;
  isActive: boolean;
}

interface PartnerForm {
  partnerName: string;
  partnerCode: string;
  integrationType: IntegrationType;
  apiBaseUrl: string;
  trackingUrlTemplate: string;
  isActive: boolean;
}

interface MethodForm {
  methodName: string;
  methodCode: string;
  estimatedMinDays: string;
  estimatedMaxDays: string;
  baseCharge: string;
  perKgCharge: string;
  maxWeightKg: string;
  isActive: boolean;
}

const EMPTY_PARTNER_FORM: PartnerForm = {
  partnerName: "",
  partnerCode: "",
  integrationType: "MANUAL",
  apiBaseUrl: "",
  trackingUrlTemplate: "",
  isActive: true,
};

const EMPTY_METHOD_FORM: MethodForm = {
  methodName: "",
  methodCode: "",
  estimatedMinDays: "1",
  estimatedMaxDays: "3",
  baseCharge: "0",
  perKgCharge: "0",
  maxWeightKg: "",
  isActive: true,
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400";
const labelClass = "block text-xs font-medium text-gray-500 mb-1";

export default function PartnersManager() {
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [methods, setMethods] = useState<MethodRow[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partnerForm, setPartnerForm] =
    useState<PartnerForm>(EMPTY_PARTNER_FORM);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(
    null,
  );
  const [methodForm, setMethodForm] = useState<MethodForm>(EMPTY_METHOD_FORM);
  const [editingMethodId, setEditingMethodId] = useState<string | null>(null);

  const reloadPartners = useCallback(async () => {
    const data = await adminApi<{ partners: PartnerRow[] }>(
      "/api/admin/partners",
    );
    setPartners(data.partners);
    setSelectedPartnerId((current) => current ?? data.partners[0]?.id ?? null);
  }, []);

  const reloadMethods = useCallback(async (partnerId: string) => {
    const data = await adminApi<{ methods: MethodRow[] }>(
      `/api/admin/partners/${partnerId}/methods`,
    );
    setMethods(data.methods);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await reloadPartners();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load partners");
      } finally {
        setLoading(false);
      }
    })();
  }, [reloadPartners]);

  useEffect(() => {
    if (!selectedPartnerId) {
      setMethods([]);
      return;
    }
    reloadMethods(selectedPartnerId).catch((err: unknown) =>
      setError(err instanceof Error ? err.message : "Failed to load methods"),
    );
  }, [selectedPartnerId, reloadMethods]);

  const submitPartner = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const payload = {
        partnerName: partnerForm.partnerName,
        partnerCode: partnerForm.partnerCode,
        integrationType: partnerForm.integrationType,
        apiBaseUrl: partnerForm.apiBaseUrl || null,
        trackingUrlTemplate: partnerForm.trackingUrlTemplate || null,
        isActive: partnerForm.isActive,
      };
      if (editingPartnerId) {
        await adminApi(`/api/admin/partners/${editingPartnerId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminApi("/api/admin/partners", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setPartnerForm(EMPTY_PARTNER_FORM);
      setEditingPartnerId(null);
      await reloadPartners();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save partner");
    }
  };

  const submitMethod = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedPartnerId) return;
    setError(null);
    try {
      const payload = {
        methodName: methodForm.methodName,
        methodCode: methodForm.methodCode,
        estimatedMinDays: Number(methodForm.estimatedMinDays),
        estimatedMaxDays: Number(methodForm.estimatedMaxDays),
        baseCharge: Number(methodForm.baseCharge),
        perKgCharge: Number(methodForm.perKgCharge),
        maxWeightKg: methodForm.maxWeightKg
          ? Number(methodForm.maxWeightKg)
          : null,
        isActive: methodForm.isActive,
      };
      if (editingMethodId) {
        await adminApi(`/api/admin/methods/${editingMethodId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminApi(`/api/admin/partners/${selectedPartnerId}/methods`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setMethodForm(EMPTY_METHOD_FORM);
      setEditingMethodId(null);
      await reloadMethods(selectedPartnerId);
      await reloadPartners();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save method");
    }
  };

  const selectedPartner = partners.find((p) => p.id === selectedPartnerId);

  return (
    <div className="flex flex-col space-y-6">
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={submitPartner}
        className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
      >
        <p className="text-sm font-semibold text-gray-900">
          {editingPartnerId ? "Edit partner" : "Add partner"}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className={labelClass}>Partner name *</label>
            <input
              className={inputClass}
              value={partnerForm.partnerName}
              onChange={(e) =>
                setPartnerForm({ ...partnerForm, partnerName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className={labelClass}>Partner code *</label>
            <input
              className={inputClass}
              value={partnerForm.partnerCode}
              onChange={(e) =>
                setPartnerForm({ ...partnerForm, partnerCode: e.target.value })
              }
              placeholder="e.g. DELHIVERY"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Integration type</label>
            <select
              className={inputClass}
              value={partnerForm.integrationType}
              onChange={(e) =>
                setPartnerForm({
                  ...partnerForm,
                  integrationType: e.target.value as IntegrationType,
                })
              }
            >
              <option value="AGGREGATOR_API">AGGREGATOR_API</option>
              <option value="DIRECT_API">DIRECT_API</option>
              <option value="MANUAL">MANUAL</option>
              <option value="INHOUSE">INHOUSE</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>API base URL</label>
            <input
              className={inputClass}
              value={partnerForm.apiBaseUrl}
              onChange={(e) =>
                setPartnerForm({ ...partnerForm, apiBaseUrl: e.target.value })
              }
              placeholder="https://…"
            />
          </div>
          <div>
            <label className={labelClass}>Tracking URL template</label>
            <input
              className={inputClass}
              value={partnerForm.trackingUrlTemplate}
              onChange={(e) =>
                setPartnerForm({
                  ...partnerForm,
                  trackingUrlTemplate: e.target.value,
                })
              }
              placeholder="https://…/track/{awb}"
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={partnerForm.isActive}
                onChange={(e) =>
                  setPartnerForm({
                    ...partnerForm,
                    isActive: e.target.checked,
                  })
                }
              />
              Active
            </label>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            {editingPartnerId ? "Save changes" : "Add partner"}
          </button>
          {editingPartnerId && (
            <button
              type="button"
              onClick={() => {
                setEditingPartnerId(null);
                setPartnerForm(EMPTY_PARTNER_FORM);
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
          <p className="p-5 text-sm text-gray-400">Loading partners…</p>
        ) : partners.length === 0 ? (
          <p className="p-5 text-sm text-gray-400">No partners yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-[#FAFAFA] text-xs text-gray-400 uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Partner</th>
                <th className="px-5 py-3 font-medium">Integration</th>
                <th className="px-5 py-3 font-medium">Methods</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr
                  key={partner.id}
                  className={`cursor-pointer border-b border-gray-50 ${
                    partner.id === selectedPartnerId ? "bg-slate-50" : ""
                  }`}
                  onClick={() => setSelectedPartnerId(partner.id)}
                >
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">
                      {partner.partnerName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {partner.partnerCode}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {partner.integrationType}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {partner.methodsCount}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {partner.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPartnerId(partner.id);
                        setPartnerForm({
                          partnerName: partner.partnerName,
                          partnerCode: partner.partnerCode,
                          integrationType: partner.integrationType,
                          apiBaseUrl: partner.apiBaseUrl ?? "",
                          trackingUrlTemplate:
                            partner.trackingUrlTemplate ?? "",
                          isActive: partner.isActive,
                        });
                      }}
                      className="font-medium text-gray-700 hover:text-gray-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedPartner && (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">
            Shipping methods — {selectedPartner.partnerName}
          </p>

          {methods.length === 0 ? (
            <p className="mt-3 text-sm text-gray-400">
              No methods for this partner yet.
            </p>
          ) : (
            <table className="mt-3 w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs text-gray-400 uppercase">
                <tr>
                  <th className="py-2 font-medium">Method</th>
                  <th className="py-2 font-medium">Delivery window</th>
                  <th className="py-2 font-medium">Base charge</th>
                  <th className="py-2 font-medium">Per-kg</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {methods.map((method) => (
                  <tr key={method.id} className="border-b border-gray-50">
                    <td className="py-2">
                      <p className="font-medium text-gray-900">
                        {method.methodName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {method.methodCode}
                      </p>
                    </td>
                    <td className="py-2 text-gray-600">
                      {method.estimatedMinDays}–{method.estimatedMaxDays} days
                    </td>
                    <td className="py-2 text-gray-600">
                      ₹{Number(method.baseCharge).toFixed(2)}
                    </td>
                    <td className="py-2 text-gray-600">
                      ₹{Number(method.perKgCharge).toFixed(2)}
                    </td>
                    <td className="py-2 text-gray-600">
                      {method.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => {
                          setEditingMethodId(method.id);
                          setMethodForm({
                            methodName: method.methodName,
                            methodCode: method.methodCode,
                            estimatedMinDays: String(method.estimatedMinDays),
                            estimatedMaxDays: String(method.estimatedMaxDays),
                            baseCharge: method.baseCharge,
                            perKgCharge: method.perKgCharge,
                            maxWeightKg: method.maxWeightKg ?? "",
                            isActive: method.isActive,
                          });
                        }}
                        className="font-medium text-gray-700 hover:text-gray-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <form
            onSubmit={submitMethod}
            className="mt-5 border-t border-gray-100 pt-4"
          >
            <p className="text-sm font-semibold text-gray-900">
              {editingMethodId ? "Edit method" : "Add method"}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className={labelClass}>Method name *</label>
                <input
                  className={inputClass}
                  value={methodForm.methodName}
                  onChange={(e) =>
                    setMethodForm({ ...methodForm, methodName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Method code *</label>
                <input
                  className={inputClass}
                  value={methodForm.methodCode}
                  onChange={(e) =>
                    setMethodForm({ ...methodForm, methodCode: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Min days</label>
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  value={methodForm.estimatedMinDays}
                  onChange={(e) =>
                    setMethodForm({
                      ...methodForm,
                      estimatedMinDays: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Max days</label>
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  value={methodForm.estimatedMaxDays}
                  onChange={(e) =>
                    setMethodForm({
                      ...methodForm,
                      estimatedMaxDays: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Base charge (₹)</label>
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="0.01"
                  value={methodForm.baseCharge}
                  onChange={(e) =>
                    setMethodForm({ ...methodForm, baseCharge: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Per-kg charge (₹)</label>
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="0.01"
                  value={methodForm.perKgCharge}
                  onChange={(e) =>
                    setMethodForm({
                      ...methodForm,
                      perKgCharge: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Max weight (kg)</label>
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="0.01"
                  value={methodForm.maxWeightKg}
                  onChange={(e) =>
                    setMethodForm({
                      ...methodForm,
                      maxWeightKg: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={methodForm.isActive}
                    onChange={(e) =>
                      setMethodForm({
                        ...methodForm,
                        isActive: e.target.checked,
                      })
                    }
                  />
                  Active
                </label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                {editingMethodId ? "Save changes" : "Add method"}
              </button>
              {editingMethodId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingMethodId(null);
                    setMethodForm(EMPTY_METHOD_FORM);
                  }}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
