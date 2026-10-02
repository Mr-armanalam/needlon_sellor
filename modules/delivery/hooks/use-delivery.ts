import { useState, useEffect, useCallback } from "react";
import { ShipmentResponseDto } from "../dto/delivery.dto";

export function useDelivery(options?: { statusFilter?: string }) {
  const [partners, setPartners] = useState<any[]>([]);
  const [shipments, setShipments] = useState<ShipmentResponseDto[]>([]);
  const [counts, setCounts] = useState({ total: 0, inTransit: 0, delivered: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliveryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [partnersRes, shipmentsRes] = await Promise.all([
        fetch("/api/seller/delivery/partners"),
        fetch(`/api/seller/delivery/shipments${options?.statusFilter ? `?status=${options.statusFilter}` : ""}`),
      ]);

      const partnersJson = await partnersRes.json();
      const shipmentsJson = await shipmentsRes.json();

      if (partnersJson.success && partnersJson.data) {
        setPartners(partnersJson.data.partners || []);
      }
      if (shipmentsJson.success && shipmentsJson.data) {
        setShipments(shipmentsJson.data.shipments || []);
        setCounts(shipmentsJson.data.counts || { total: 0, inTransit: 0, delivered: 0, pending: 0 });
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
    counts,
    loading,
    error,
    refetch: fetchDeliveryData,
    updateStatus,
  };
}
