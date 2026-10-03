import { useState, useEffect, useCallback } from "react";
import { ShipmentResponseDto, ConnectCarrierDto } from "../dto/delivery.dto";

export function useDelivery(options?: { statusFilter?: string }) {
  const [partners, setPartners] = useState<any[]>([]);
  const [shipments, setShipments] = useState<ShipmentResponseDto[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [counts, setCounts] = useState({ total: 0, inTransit: 0, delivered: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliveryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [partnersRes, shipmentsRes, settingsRes] = await Promise.all([
        fetch("/api/seller/delivery/partners"),
        fetch(`/api/seller/delivery/shipments${options?.statusFilter ? `?status=${options.statusFilter}` : ""}`),
        fetch("/api/seller/delivery/settings"),
      ]);

      const partnersJson = await partnersRes.json();
      const shipmentsJson = await shipmentsRes.json();
      const settingsJson = await settingsRes.json();

      if (partnersJson.success && partnersJson.data) {
        setPartners(partnersJson.data.partners || []);
      }
      if (shipmentsJson.success && shipmentsJson.data) {
        setShipments(shipmentsJson.data.shipments || []);
        setCounts(shipmentsJson.data.counts || { total: 0, inTransit: 1, delivered: 2, pending: 0 });
      }
      if (settingsJson.success && settingsJson.data) {
        setSettings(settingsJson.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load delivery data");
    } finally {
      setLoading(false);
    }
  }, [options?.statusFilter]);

  useEffect(() => {
    fetchDeliveryData();
  }, [fetchDeliveryData]);

  const connectCarrier = async (dto: ConnectCarrierDto) => {
    const res = await fetch("/api/seller/delivery/partners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || "Failed to connect carrier");
    await fetchDeliveryData();
    return json.data;
  };

  const updateDeliverySettings = async (type: "LOCAL_RADIUS" | "PICKUP_HUB" | "SHIPPING_ZONE", data: any) => {
    const res = await fetch("/api/seller/delivery/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || "Failed to save delivery settings");
    await fetchDeliveryData();
    return json.data;
  };

  const createShipment = async (dto: any) => {
    const res = await fetch("/api/seller/delivery/shipments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || "Failed to create shipment AWB");
    await fetchDeliveryData();
    return json.data;
  };

  const updateStatus = async (shipmentId: string, status: string, trackingNumber?: string) => {
    try {
      const res = await fetch(`/api/seller/delivery/shipments/${shipmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipmentId, status, trackingNumber }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchDeliveryData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return {
    partners,
    shipments,
    settings,
    counts,
    loading,
    error,
    refetch: fetchDeliveryData,
    connectCarrier,
    updateDeliverySettings,
    createShipment,
    updateStatus,
  };
}
