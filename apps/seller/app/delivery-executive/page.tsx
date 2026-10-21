"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  LogOut,
  MapPin,
  Package,
  Phone,
  Truck,
  XCircle,
} from "lucide-react";

interface ExecutiveWire {
  id: string;
  name: string;
  phone: string;
  vehicleType: string | null;
  vehicleNumber: string | null;
}

interface DeliveryAddressWire {
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  deliveryNotes: string | null;
}

interface DeliveryWire {
  assignmentId: string;
  assignmentStatus: string;
  shipmentStatus: string;
  awbNumber: string | null;
  trackingNumber: string | null;
  codAmount: string;
  orderNumber: string;
  buyerName: string | null;
  buyerPhone: string | null;
  itemsCount: number;
  failureReason: string | null;
  deliveryAddress: DeliveryAddressWire | null;
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { message?: string };
}

type ReportableStatus = "ACCEPTED" | "PICKED_UP" | "DELIVERED" | "FAILED";

const NEXT_ACTIONS: Record<string, { status: ReportableStatus; label: string }[]> = {
  ASSIGNED: [
    { status: "ACCEPTED", label: "Accept delivery" },
    { status: "FAILED", label: "Report failure" },
  ],
  ACCEPTED: [
    { status: "PICKED_UP", label: "Mark picked up" },
    { status: "FAILED", label: "Report failure" },
  ],
  PICKED_UP: [
    { status: "DELIVERED", label: "Mark delivered" },
    { status: "FAILED", label: "Report failure" },
  ],
  DELIVERED: [],
  FAILED: [],
};

export default function DeliveryExecutivePage() {
  const [loading, setLoading] = useState(true);
  const [executive, setExecutive] = useState<ExecutiveWire | null>(null);
  const [deliveries, setDeliveries] = useState<DeliveryWire[]>([]);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyAssignmentId, setBusyAssignmentId] = useState<string | null>(null);

  const loadDeliveries = useCallback(async () => {
    try {
      const res = await fetch("/api/delivery-executive/deliveries");
      const json = (await res.json()) as ApiEnvelope<{
        executive: ExecutiveWire;
        deliveries: DeliveryWire[];
      }>;
      if (res.ok && json.success && json.data) {
        setExecutive(json.data.executive);
        setDeliveries(json.data.deliveries);
      } else {
        setExecutive(null);
        setDeliveries([]);
      }
    } catch {
      setExecutive(null);
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDeliveries();
  }, [loadDeliveries]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/delivery-executive/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const json = (await res.json()) as ApiEnvelope<{ executive: ExecutiveWire }>;
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Login failed");
      }
      await loadDeliveries();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/delivery-executive/logout", { method: "POST" });
    setExecutive(null);
    setDeliveries([]);
    setPassword("");
  };

  const handleStatus = async (delivery: DeliveryWire, status: ReportableStatus) => {
    let note: string | undefined;
    if (status === "FAILED") {
      const reason = window.prompt("Why did this delivery fail?");
      if (reason === null) return;
      note = reason || undefined;
    }
    setBusyAssignmentId(delivery.assignmentId);
    setError(null);
    try {
      const res = await fetch(
        `/api/delivery-executive/deliveries/${delivery.assignmentId}/status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, note }),
        },
      );
      const json = (await res.json()) as ApiEnvelope<unknown>;
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update status");
      }
      await loadDeliveries();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setBusyAssignmentId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-neutral-400" />
      </main>
    );
  }

  if (!executive) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-10">
        <div className="mx-auto w-full max-w-sm bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="p-3 rounded-full bg-neutral-900 text-white">
              <Truck size={22} />
            </span>
            <h1 className="text-lg font-bold text-neutral-900">Delivery Executive</h1>
            <p className="text-xs text-neutral-500">
              Sign in with your registered phone number to see your assigned deliveries.
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Phone number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white text-sm font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loginLoading && <Loader2 size={15} className="animate-spin" />}
              Sign in
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-6">
      <div className="mx-auto w-full max-w-lg flex flex-col gap-4">
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Truck size={12} /> My deliveries
            </span>
            <h1 className="text-lg font-bold text-neutral-900 mt-0.5">{executive.name}</h1>
            <span className="text-xs text-neutral-500">
              {executive.phone}
              {executive.vehicleType ? ` • ${executive.vehicleType}` : ""}
              {executive.vehicleNumber ? ` • ${executive.vehicleNumber}` : ""}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={13} /> Logout
          </button>
        </header>

        {error && (
          <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        {deliveries.length === 0 ? (
          <div className="py-10 px-4 text-center border-2 border-dashed border-neutral-200 rounded-2xl bg-white flex flex-col items-center gap-2">
            <Package size={22} className="text-neutral-400" />
            <p className="text-sm font-semibold text-neutral-700">No deliveries assigned</p>
            <p className="text-xs text-neutral-400">
              New assignments from your sellers will appear here.
            </p>
          </div>
        ) : (
          deliveries.map((delivery) => {
            const actions = NEXT_ACTIONS[delivery.assignmentStatus] ?? [];
            const busy = busyAssignmentId === delivery.assignmentId;
            return (
              <article
                key={delivery.assignmentId}
                className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-neutral-900">
                    Order {delivery.orderNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      delivery.assignmentStatus === "DELIVERED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : delivery.assignmentStatus === "FAILED"
                          ? "bg-red-50 text-red-700 border-red-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}
                  >
                    {delivery.assignmentStatus.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="flex flex-col gap-1 text-[13px] text-neutral-600">
                  <span className="font-semibold text-neutral-800">
                    {delivery.deliveryAddress?.recipientName || delivery.buyerName || "Customer"}
                  </span>
                  {(delivery.deliveryAddress?.phoneNumber || delivery.buyerPhone) && (
                    <a
                      href={`tel:${delivery.deliveryAddress?.phoneNumber || delivery.buyerPhone}`}
                      className="flex items-center gap-1.5 text-emerald-700 font-semibold"
                    >
                      <Phone size={12} />
                      {delivery.deliveryAddress?.phoneNumber || delivery.buyerPhone}
                    </a>
                  )}
                  {delivery.deliveryAddress ? (
                    <span className="flex gap-1.5 leading-relaxed">
                      <MapPin size={13} className="shrink-0 mt-0.5 text-neutral-400" />
                      <span>
                        {delivery.deliveryAddress.addressLine1}
                        {delivery.deliveryAddress.addressLine2
                          ? `, ${delivery.deliveryAddress.addressLine2}`
                          : ""}
                        {delivery.deliveryAddress.landmark
                          ? ` (Landmark: ${delivery.deliveryAddress.landmark})`
                          : ""}
                        <br />
                        {delivery.deliveryAddress.city}, {delivery.deliveryAddress.state} -{" "}
                        {delivery.deliveryAddress.postalCode}
                        {delivery.deliveryAddress.deliveryNotes
                          ? ` • ${delivery.deliveryAddress.deliveryNotes}`
                          : ""}
                      </span>
                    </span>
                  ) : (
                    <span className="text-neutral-400 italic">No delivery address recorded</span>
                  )}
                  <span className="text-xs text-neutral-400">
                    {delivery.itemsCount} item{delivery.itemsCount === 1 ? "" : "s"}
                    {delivery.trackingNumber ? ` • Tracking: ${delivery.trackingNumber}` : ""}
                    {Number(delivery.codAmount) > 0
                      ? ` • Collect ₹${delivery.codAmount} (COD)`
                      : ""}
                  </span>
                  {delivery.assignmentStatus === "FAILED" && delivery.failureReason && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      <XCircle size={12} /> {delivery.failureReason}
                    </span>
                  )}
                  {delivery.assignmentStatus === "DELIVERED" && (
                    <span className="text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Delivered
                    </span>
                  )}
                </div>

                {actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-neutral-100">
                    {actions.map((action) => (
                      <button
                        key={action.status}
                        type="button"
                        disabled={busy}
                        onClick={() => handleStatus(delivery, action.status)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                          action.status === "FAILED"
                            ? "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                            : "bg-neutral-900 hover:bg-black text-white"
                        }`}
                      >
                        {busy && <Loader2 size={13} className="animate-spin" />}
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}
